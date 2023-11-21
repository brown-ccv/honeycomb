/** ELECTRON MAIN PROCESS */

const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const log = require("electron-log");
const _ = require("lodash");
const url = require("url");
const path = require("node:path");
const fs = require("node:fs");

// TODO: Use Electron's web serial API for this
const { getPort, sendToPort } = require("event-marker");

// Early exit when installing on Windows: https://www.electronforge.io/config/makers/squirrel.windows#handling-startup-events
if (require("electron-squirrel-startup")) app.quit();

// Initialize the logger for any renderer process
log.initialize({ preload: true });

// TODO: Initialize writeable stream on login
// TODO: Handle data writing to desktop in a utility process?
// TODO: Handle video data writing to desktop in a utility process?
// TODO: Separate log files for each run through?

/************ GLOBALS ***********/

let CONFIG; // Honeycomb configuration object
let DEV_MODE; // Whether or not the application is running in dev mode
let WRITE_STREAM; // Writeable file stream for the data (in the user's appData folder)
// TODO: These should use path, and can be combined into one?
let OUT_PATH; // Path to the final output file (on the Desktop)
let OUT_FILE; // Name of the output file

let TRIGGER_CODES; // Trigger codes and IDs for the EEG machine
let TRIGGER_PORT; // Port that the EEG machine is talking through

// TODO: THis is causing an error cause it's not built into the app?
const GIT_VERSION = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../config/version.json")));

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
  ipcMain.on("onFinish", handleOnFinish);
  ipcMain.on("photodiodeTrigger", handlePhotoDiodeTrigger);
  ipcMain.on("saveVideo", handleSaveVideo);
  ipcMain.handle("checkSerialPort", handleCheckSerialPort);

  // Setup min files and create the Electron window
  setupLocalFilesNormalizerProxy();
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

/**
 * Executed before the application begins closing its windows
 * We ensure the writeable stream is closed before exiting
 */
// TODO: Check what's been written to stream? If trial hasn't finished we need to add the closing '}'
app.on("before-quit", () => {
  if (WRITE_STREAM) {
    WRITE_STREAM.write("]}");
    WRITE_STREAM.end();
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
 * @param {Object} config The current Honeycomb configuration
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

function handlePhotoDiodeTrigger(event, code) {
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

  // TODO: We should probably initialize file on login? That's how Firebase handles it
  // Set the output file names/paths and initialize a writeable stream in the user's appData folder
  if (!WRITE_STREAM) {
    // The final OUT_FILE will be nested inside subfolders on the Desktop
    OUT_PATH = path.resolve(app.getPath("desktop"), app.getName(), study_id, participant_id);
    // TODO 307: ISO 8061 data string? Doesn't include the punctuation
    OUT_FILE = `${start_date}.json`.replaceAll(":", "_"); // (":" are replaced to prevent issues with invalid file names);

    // The tempFile is nested inside "TempData" in the user's local app data folder
    const tempPath = path.resolve(app.getPath("userData"), "TempData", study_id, participant_id);
    const tempFilePath = path.resolve(tempPath, OUT_FILE);
    fs.mkdirSync(tempPath, { recursive: true });

    // Initialize the writeable stream
    WRITE_STREAM = fs.createWriteStream(tempFilePath, { flags: "ax+" });
    log.info("Writable stream created at ", tempFilePath);
    WRITE_STREAM.write("{"); // Write initial brace
    WRITE_STREAM.write(`"start_time": "${start_date}",`);
    WRITE_STREAM.write(`"git_version": ${JSON.stringify(GIT_VERSION)},`);
    WRITE_STREAM.write(`"trials": [`); // Begin writing trials array
  }

  // Prepend comma for all trials except first
  if (trial_index > 0) WRITE_STREAM.write(",");

  // Write trial data
  WRITE_STREAM.write(JSON.stringify(data));
  log.info(`Trial ${trial_index} successfully written to TempData`);
}

/**
 * Finishes writing to the writable stream and copies the file to the Desktop
 * File is saved inside ~/Desktop/[appName]/[studyID]/[participantID]/
 */
function handleOnFinish() {
  log.info("Experiment Finished");
  const tempFilePath = WRITE_STREAM.path;
  const filePath = path.resolve(OUT_PATH, OUT_FILE);

  // Finish writing JSON and dereference WRITE_STREAM
  WRITE_STREAM.write("]}");
  WRITE_STREAM.end();
  WRITE_STREAM = undefined;
  log.info("Finished writing experiment data to TempData");

  // Copy temp file to Desktop
  try {
    fs.mkdirSync(OUT_PATH, { recursive: true });
    fs.copyFileSync(tempFilePath, filePath);
  } catch (e) {
    log.error.error("Unable to save file: ", filePath);
    log.error.error(e);
  }
  log.info("Successfully saved experiment data to ", filePath);
}

// Save webm video file
// TODO: Rolling save of webm video, remux to mp4 at the end?
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
    // TODO: Convert to mp4 before final save? https://gist.github.com/AVGP/4c2ce4ab3c67760a0f30a9d54544a060
    fs.writeFileSync(path.join(OUT_PATH, filePath), videoData);
  } catch (e) {
    log.error.error("Unable to save file: ", filePath);
    log.error.error(e);
  }
  log.info("Successfully saved video file to ", filePath);
}

/********** HELPERS **********/

/** Creates a new Electron window. */
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1500,
    height: 900,
    icon: "./favicon.ico",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  /**
   * Load the app into the Electron window
   * In production it loads the local bundle created by the build process
   * In development we use ELECTRON_START_URL (This allows hot-reloading)
   */
  const appURL =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true,
    });
  log.info("Loading URL: ", appURL);
  mainWindow.loadURL(appURL);

  // Open the dev tools in development
  if (process.env.ELECTRON_START_URL) mainWindow.webContents.openDevTools();
  // Maximize the window in production
  else mainWindow.maximize();
}

/**
 * Set up a local proxy to adjust the paths of requested files
 * when loading them from the production bundle (e.g. local fonts, etc...).
 */
// TODO: This is deprecated but needed to load the min files? https://www.electronjs.org/docs/latest/api/protocol#protocolhandlescheme-handler
function setupLocalFilesNormalizerProxy() {
  // protocol.registerHttpProtocol(
  //   "file",
  //   (request, callback) => {
  //     const url = request.url.substr(8);
  //     callback({ path: path.normalize(`${__dirname}/${url}`) });
  //   },
  //   (error) => {
  //     if (error) console.error("Failed to register protocol");
  //   }
  // );
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

      // This dialog will should if there is any error with the TRIGGER_PORT
      // TODo: Clean up this dialog to better reflect what the error is?
      // TODO: Let this just be dialog.showErrorBox?
      dialog
        .showMessageBox(null, {
          type: "error",
          message: "Unable to communicate with event marker.",
          title: "USB Error",
          buttons: [
            "OK",
            // Allow continuation when running in development mode
            ...(process.env.ELECTRON_START_URL ? ["Continue Anyway"] : []),
          ],
          defaultId: 0,
        })
        .then((opt) => {
          log.info(opt);
          if (opt.response === 0) {
            // Quit app when user selects "OK"
            app.exit();
          } else {
            // User selected "Continue Anyway", we must be in dev mode
            DEV_MODE = true;
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
  if (TRIGGER_PORT !== undefined && !DEV_MODE) {
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
        ...(process.env.ELECTRON_START_URL ? ["Continue Anyway"] : []),
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
        DEV_MODE = true;
        break;
    }
  }
}
