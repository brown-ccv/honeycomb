/** ELECTRON MAIN PROCESS */

const url = require("url");
const path = require("node:path");
const fs = require("node:fs");

const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const log = require("electron-log");
const _ = require("lodash");

// TODO @brown-ccv #340: Use Electron's web serial API (remove event-marker dependency)
const { getPort, sendToPort } = require("event-marker");

// Early exit when installing on Windows: https://www.electronforge.io/config/makers/squirrel.windows#handling-startup-events
if (require("electron-squirrel-startup")) app.quit();

// Initialize the logger for any renderer process
log.initialize({ preload: true });

// TODO @brown-ccv #192: Handle data writing to desktop in a utility process
// TODO @brown-ccv #192: Handle video data writing to desktop in a utility process
// TODO @brown-ccv #398: Separate log files for each run through
// TODO @brown-ccv #429: Use app.getPath('temp') for temporary JSON file

/************ GLOBALS ***********/

const GIT_VERSION = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../version.json")));
// TODO @brown-ccv #436 : Use app.isPackaged() to determine if running in dev or prod
const ELECTRON_START_URL = process.env.ELECTRON_START_URL;

let CONFIG; // Honeycomb configuration object
let CONTINUE_ANYWAY; // Whether to continue the experiment with no hardware connected (option is only available in dev mode)

let TEMP_FILE; // Path to the temporary output file
let OUT_PATH; // Path to the final output folder (on the Desktop)
let OUT_FILE; // Name of the final output file

let TRIGGER_CODES; // Trigger codes and IDs for the EEG machine
let TRIGGER_PORT; // Port that the EEG machine is talking through

/************ APP LIFECYCLE ***********/

/**
 * Executed when the app is initialized
 * @windows Builds the Electron window
 * @mac Builds the Electron window
 */
app.whenReady().then(() => {
  log.info("App Ready: ", app.name);

  // Handle ipcRenderer events (on is renderer -> main, handle is renderer <--> main)
  ipcMain.on("setConfig", handleSetConfig);
  ipcMain.on("setTrigger", handleSetTrigger);
  ipcMain.handle("getCredentials", handleGetCredentials);
  ipcMain.on("onDataUpdate", handleOnDataUpdate);
  ipcMain.handle("onFinish", handleOnFinish);
  ipcMain.on("photodiodeTrigger", handlePhotodiodeTrigger);
  ipcMain.on("saveVideo", handleSaveVideo);
  ipcMain.handle("checkSerialPort", handleCheckSerialPort);

  // Create the Electron window
  createWindow();

  /**
   * Executed when the app is launched (e.g. clicked on from the taskbar)
   * @windows Creates a new window if there are none (note this shouldn't happen because the app is quit when there are no Windows)
   * @mac Creates a new window if there are none
   */
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

/**
 * Executed when all app windows are closed
 * @windows Quits the application
 * @mac Closes the window, app remains running in the Dock
 */
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

/** Executed before the application begins closing its windows */
app.on("before-quit", () => {
  log.info("Attempting to quit application");
  try {
    JSON.parse(fs.readFileSync(TEMP_FILE));
  } catch (error) {
    if (error instanceof TypeError) {
      // TEMP_FILE is undefined at this point
      log.warn("Application quit before the participant started the experiment");
    } else if (error instanceof SyntaxError) {
      // Trials are still being written (i.e. hasn't hit handleOnFinish function)
      log.warn("Application quit while the participant was completing the experiment");
    } else {
      log.error("Electron encountered an error while quitting:");
      log.error(error);
    }
  }
});

/** Log any uncaught exceptions before quitting */
process.on("uncaughtException", (error) => {
  log.error(error);
  app.quit();
});

/*********** RENDERER EVENT HANDLERS ***********/

/**
 * Receives the Honeycomb config settings and passes them to the CONFIG global in this file
 * @param {Event} event The Electron renderer event
 * @param {Object} config The current Honeycomb configuration
 */
function handleSetConfig(event, config) {
  CONFIG = config;
  log.info("Honeycomb Configuration: ", CONFIG);
}

/**
 * Receives the Honeycomb config settings and passes them to the CONFIG global in this file
 * @param {Event} event The Electron renderer event
 * @param {Object} trigger The metadata for the event code trigger
 * @param {string} trigger.comName The COM name of the serial port
 * @param {Object} trigger.eventCodes The list of possible event codes to be triggered
 * @param {string} trigger.productID The name of the product connected to the serial port
 * @param {string} trigger.vendorID The name of the vendor connected to the serial prot
 */
function handleSetTrigger(event, trigger) {
  TRIGGER_CODES = trigger;
  log.info("Trigger Codes: ", TRIGGER_CODES);
}

/**
 * Checks for REACT_APP_STUDY_ID and REACT_APP_PARTICIPANT_ID environment variables
 * Note that studyID and participantID are undefined when the environment variables are not given
 * @returns An object containing a studyID and participantID
 */
function handleGetCredentials() {
  const studyID = process.env.REACT_APP_STUDY_ID;
  const participantID = process.env.REACT_APP_PARTICIPANT_ID;
  if (studyID) log.info("Received study from ENV: ", studyID);
  if (participantID) log.info("Received participant from ENV: ", participantID);
  return { studyID, participantID };
}

/**
 * @returns {Boolean} Whether or not the EEG machine is connected to the computer
 */
function handleCheckSerialPort() {
  setUpPort().then(() => handleEventSend(TRIGGER_CODES.eventCodes.test_connect));
}

/**
 * Sends the event_codes to the trigger port
 * @param {} event The serial port event
 * @param {number} code The event code to be recorded
 */
function handlePhotodiodeTrigger(event, code) {
  if (code !== undefined) {
    log.info(`Event: ${_.invert(TRIGGER_CODES.eventCodes)[code]}, code: ${code}`);
    handleEventSend(code);
  } else {
    log.warn("Photodiode event triggered but no code was sent");
  }
}

/**
 * Receives the trial data and writes it to a temp file in AppData
 * The out path/file and writable stream are initialized if isn't yet
 * The temp file is written at ~/userData/[appName]/TempData/[studyID]/[participantID]/
 * @param {Event} event The Electron renderer event
 * @param {Object} data The trial data
 */
function handleOnDataUpdate(event, data) {
  const { participant_id, study_id, start_date, trial_index } = data;

  // Set the output path and file name if they are not set yet
  if (!OUT_PATH) {
    // The final OUT_FILE will be nested inside subfolders on the Desktop
    OUT_PATH = path.resolve(app.getPath("desktop"), app.getName(), study_id, participant_id);
    // TODO @brown-ccv #307: ISO 8061 data string? Doesn't include the punctuation
    OUT_FILE = `${start_date}.json`.replaceAll(":", "_"); // (":" are replaced to prevent issues with invalid file names);
  }

  // Create the temporary folder & file if it hasn't been created
  // TODO @brown-ccv #397: Initialize file stream on login, not here
  if (!TEMP_FILE) {
    // The tempFile is nested inside "TempData" in the user's local app data folder
    const tempPath = path.resolve(app.getPath("userData"), "TempData", study_id, participant_id);
    fs.mkdirSync(tempPath, { recursive: true });
    TEMP_FILE = path.resolve(tempPath, OUT_FILE);

    // Write initial bracket
    fs.appendFileSync(TEMP_FILE, "{");
    log.info("Temporary file created at ", TEMP_FILE);

    // Write useful information and the beginning of the trials array
    fs.appendFileSync(TEMP_FILE, `"start_time": "${start_date}",`);
    fs.appendFileSync(TEMP_FILE, `"git_version": ${JSON.stringify(GIT_VERSION)},`);
    fs.appendFileSync(TEMP_FILE, `"trials": [`);
  }

  // Prepend comma for all trials except first
  if (trial_index > 0) fs.appendFileSync(TEMP_FILE, ",");

  // Write trial data
  fs.appendFileSync(TEMP_FILE, JSON.stringify(data));

  log.info(`Trial ${trial_index} successfully written to TempData`);
}

/**
 * Finishes writing to the writable stream and copies the file to the Desktop
 * File is saved inside ~/Desktop/[appName]/[studyID]/[participantID]/
 */
function handleOnFinish() {
  log.info("Experiment Finished");

  // Finish writing JSON
  fs.appendFileSync(TEMP_FILE, "]}");
  log.info("Finished writing experiment data to TempData");

  // Move temp file to the output location
  const filePath = path.resolve(OUT_PATH, OUT_FILE);
  try {
    fs.mkdirSync(OUT_PATH, { recursive: true });
    fs.copyFileSync(TEMP_FILE, filePath);
    log.info("Successfully saved experiment data to ", filePath);
  } catch (e) {
    log.error.error("Unable to save file: ", filePath);
    log.error.error(e);
  }
  app.quit();
}

// Save webm video file
// TODO @brown-ccv #342: Rolling save of webm video, remux to mp4 at the end?
function handleSaveVideo(event, data) {
  // Video file is the same as OUT_FILE except it's mp4, not json
  const filePath = path.join(
    path.dirname(OUT_FILE),
    path.basename(OUT_FILE, path.extname(OUT_FILE)) + ".webm"
  );

  log.info(filePath);

  // Save video file to the desktop
  try {
    // Note the video data is sent to the main process as a base64 string
    const videoData = Buffer.from(data.split(",")[1], "base64");

    fs.mkdirSync(OUT_PATH, { recursive: true });
    // TODO @brown-ccv #342: Convert to mp4 before final save? https://gist.github.com/AVGP/4c2ce4ab3c67760a0f30a9d54544a060
    fs.writeFileSync(path.join(OUT_PATH, filePath), videoData);
  } catch (e) {
    log.error.error("Unable to save file: ", filePath);
    log.error.error(e);
  }
  log.info("Successfully saved video file to ", filePath);
}

/********** HELPERS **********/

/**
 * Load the app into the Electron window
 * In production it loads the local bundle created by the build process
 */
function createWindow() {
  let mainWindow;
  let appURL;

  if (ELECTRON_START_URL) {
    // Running in development

    // Load app from localhost (This allows hot-reloading)
    appURL = ELECTRON_START_URL;

    // Create a 1500x900 window with the dev tools open
    mainWindow = new BrowserWindow({
      icon: "./favicon.ico",
      webPreferences: { preload: path.join(__dirname, "preload.js") },
      width: 1500,
      height: 900,
    });

    // Open the dev tools
    mainWindow.webContents.openDevTools();
  } else {
    // Running in production

    // Load app from the local bundle created by the build process
    appURL = url.format({
      // Moves from path of the electron file (/public/electron/main.js) to build folder (build/index.html)
      // TODO @brown-ccv #424: electron-forge should only be packaging the build folder (package.json needs to point to that file?)
      pathname: path.join(__dirname, "../../build/index.html"),
      protocol: "file:",
      slashes: true,
    });

    // Create a fullscreen window with the menu bar hidden
    mainWindow = new BrowserWindow({
      icon: "./favicon.ico",
      webPreferences: { preload: path.join(__dirname, "preload.js") },
      fullscreen: true,
      menuBarVisible: false,
    });

    // Hide the menu bar
    mainWindow.setMenuBarVisibility(false);
  }

  // Load web contents at the given URL
  log.info("Loading URL: ", appURL);
  mainWindow.loadURL(appURL);
}

/** SERIAL PORT SETUP & COMMUNICATION (EVENT MARKER) */

/**
 * Checks the connection to an EEG machine via USB ports
 */
async function setUpPort() {
  log.info("Setting up USB port");
  const { productID, comName, vendorID } = TRIGGER_CODES;

  let maybePort;
  if (productID) {
    // Check port based on productID
    log.info("Received a product ID:", productID);
    maybePort = await getPort(vendorID, productID);
  } else {
    // Check port based on COM name
    log.info("No product ID, defaulting to COM:", comName);
    maybePort = await getPort(comName);
  }

  if (maybePort !== false) {
    TRIGGER_PORT = maybePort;

    // Show dialog box if trigger port has any errors
    TRIGGER_PORT.on("error", (err) => {
      log.error(err);

      // Displays as a dialog if there Electron is unable to communicate with the event marker's serial port
      // TODO @brown-ccv #400: Let this just be dialog.showErrorBox?
      dialog
        .showMessageBox(null, {
          type: "error",
          message: "There was an error with event marker's serial port.",
          title: "USB Error",
          buttons: [
            "OK",
            // Allow continuation when running in development mode
            ...(ELECTRON_START_URL ? ["Continue Anyway"] : []),
          ],
          defaultId: 0,
        })
        .then((opt) => {
          log.info(opt);
          if (opt.response === 0) {
            // Quit app when user selects "OK"
            app.exit();
          } else {
            // User selected "Continue Anyway", trigger port is not connected
            CONTINUE_ANYWAY = true;
            TRIGGER_PORT = undefined;
          }
        });
    });
  } else {
    // Unable to connect to a port
    TRIGGER_PORT = undefined;
    log.warn("USB port was not connected");
  }
}

/**
 * Handles the sending of an event code to TRIGGER_PORT
 * @param code The code to send via USB
 */
function handleEventSend(code) {
  log.info(`Sending USB event ${code} to port ${TRIGGER_PORT}`);

  // Early return when running in development (no trigger port is expected)
  if (CONTINUE_ANYWAY) return;

  if (TRIGGER_PORT !== undefined) {
    sendToPort(TRIGGER_PORT, code);
  } else {
    log.error(`Trigger port is undefined - Event Marker is not connected`);

    // Display error menu
    const response = dialog.showMessageBoxSync(null, {
      type: "error",
      message: "Event Marker is not connected",
      title: "USB Error",
      buttons: [
        "Quit",
        "Retry",
        // Allow continuation when running in development mode
        ...(ELECTRON_START_URL ? ["Continue Anyway"] : []),
      ],
      detail: "heres some detail",
    });

    switch (response) {
      case 0:
        // User selects "Quit"
        app.exit();
        break;
      case 1:
        // User selects "Retry" so we reset the port and try again
        setUpPort().then(() => handleEventSend(code));
        break;
      case 2:
        // User selects "Continue Anyway", we must be in dev mode
        CONTINUE_ANYWAY = true;
        break;
    }
  }
}
