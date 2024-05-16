/** ELECTRON MAIN PROCESS */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

import { BrowserWindow, app, dialog, ipcMain } from "electron";
import log from "electron-log";
import _ from "lodash";

import { getPort, sendToPort } from "./lib/serialport";

// TODO @RobertGemmaJr: Do more testing with the environment variables - are home/clinic being built correctly?

// TODO @brown-ccv #192: Handle data writing to desktop in a utility process
// TODO @brown-ccv #192: Handle video data writing to desktop in a utility process

/************ GLOBALS ***********/

/* global MAIN_WINDOW_VITE_DEV_SERVER_URL */
/* global MAIN_WINDOW_VITE_NAME */

const IS_DEV = import.meta.env.DEV && !app.isPackaged;
let CONTINUE_ANYWAY; // Whether to continue the experiment with no hardware connected

const DATA_DIR = path.resolve(app.getPath("userData")); // Path to the apps data directory
// TODO @brown-ccv: Is there a way to make this configurable without touching code?
const OUT_DIR = path.resolve(app.getPath("desktop"), app.getName()); // Path to the final output folder
let FILE_PATH; // Relative path to the data file.

let CONFIG; // Honeycomb configuration object
let TRIGGER_CODES; // Trigger codes and IDs for the EEG machine
let TRIGGER_PORT; // Port that the EEG machine is talking through

// TODO: Fix the security policy instead of ignoring
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

/************ APP LIFECYCLE ***********/

// Early exit when installing on Windows: https://www.electronforge.io/config/makers/squirrel.windows#handling-startup-events
if (require("electron-squirrel-startup")) app.quit();

// Initialize the logger
// TODO @brown-ccv #398: Handle logs in app.getPath('logs')
// TODO @brown-ccv #398: Separate log files for each run through
// TODO @brown-ccv #398: Spy on the renderer process too?
log.initialize({ preload: true });

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
  ipcMain.handle("getGit", handleGetGit);
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
    JSON.parse(fs.readFileSync(getDataPath()));
  } catch (error) {
    if (error instanceof TypeError) {
      // The JSON file has not been created yet
      log.warn("Application quit before the participant started the experiment");
    } else if (error instanceof SyntaxError) {
      // Trials are still being written (i.e. hasn't hit handleOnFinish function)
      // NOTE: The error occurs because the file is not a valid JSON document
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
 * Checks for VITE_STUDY_ID and VITE_PARTICIPANT_ID environment variables
 * Note that studyID and participantID are undefined when the environment variables are not given
 * @returns An object containing a studyID and participantID
 */
function handleGetCredentials() {
  const studyID = process.env.VITE_STUDY_ID;
  const participantID = process.env.VITE_PARTICIPANT_ID;
  if (studyID) log.info("Received study from ENV: ", studyID);
  if (participantID) log.info("Received participant from ENV: ", participantID);
  return { studyID, participantID };
}

/**
 * Retrieves the Git Commit SHA and Branch of the repository
 * A version.json file is created during build-time that can be read from
 * @returns An object containing the git commit sha and branch of the codebase
 */
async function handleGetGit() {
  try {
    if (!IS_DEV) {
      // Get the Git Commit SHA and Branch of the repository
      return {
        sha: execSync("git rev-parse HEAD").toString().trim(),
        ref: execSync("git branch --show-current").toString().trim(),
      };
    } else {
      // Load the Git Commit SHA and Branch that was created at build-time
      return JSON.parse(fs.readFileSync(path.resolve(__dirname, "version.json")));
    }
  } catch (e) {
    log.error("Unable to determine git version");
    log.error(e);
  }
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
 * The temp file is written at ~/userData/[appName]/data/[mode]/[studyID]/[participantID]/[start_date].json
 * @param {Event} event The Electron renderer event
 * @param {Object} data The trial data
 */
// TODO @brown-ccv #397: Handle FILE_PATH creation when user logs in, not here
function handleOnDataUpdate(event, data) {
  const { participant_id, study_id, start_date, trial_index } = data;

  // The data file has not been created yet
  if (!FILE_PATH) {
    // Build the relative file path to the file
    FILE_PATH = path.join(
      "data",
      import.meta.env.MODE,
      study_id,
      participant_id,
      // TODO @brown-ccv #307: Use ISO 8061 date? Doesn't include the punctuation (here and in Firebase)
      `${start_date}.json`.replaceAll(":", "_") // (":" are replaced to prevent issues with invalid file names
    );

    // Create the data file in userData
    const dataPath = getDataPath();
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, "");
    log.info("Data file created at ", dataPath);

    // Write basic data and initialize the trials array
    // TODO @RobertGemmaJr: Handle this entirely in jsPsych, needs to match Firebase
    // TODO: Same thing with the start data here?
    fs.appendFileSync(dataPath, "{");
    fs.appendFileSync(dataPath, `"start_time": "${start_date}",`);
    fs.appendFileSync(dataPath, `"trials": [`);
  }

  const dataPath = getDataPath();

  // TODO @brown-ccv #397: I can set a constant for the full path once the stream is created elsewhere
  // Write trial data
  if (trial_index > 0) fs.appendFileSync(dataPath, ","); // Prepend comma if needed
  fs.appendFileSync(dataPath, JSON.stringify(data));

  log.info(`Trial ${trial_index} successfully written`);
}

/**
 * Finishes writing to the writable stream and copies the file to the Desktop
 * File is saved inside ~/Desktop/[appName]/[studyID]/[participantID]/
 */
function handleOnFinish() {
  log.info("Experiment Finished");

  const dataPath = getDataPath();
  const outPath = getOutPath();

  // Finish writing JSON
  fs.appendFileSync(dataPath, "]}");
  log.info(`Finished writing experiment data to ${dataPath}`);

  try {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.copyFileSync(dataPath, outPath);
    log.info("Successfully saved experiment data to ", outPath);
  } catch (e) {
    log.error("Unable to save file: ", outPath);
    log.error(e);
  }
  app.quit();
}

// Save webm video file
// TODO @brown-ccv #342: Rolling save of webm video, remux to mp4 at the end?
// TODO @brown-ccv #301: Handle video recordings with jsPsych
function handleSaveVideo(event, data) {
  // Video file is the same as OUT_FILE except it's mp4, not json
  const outPath = getOutPath();
  const videoFile = path.join(
    path.dirname(outPath),
    path.basename(outPath, path.extname(outPath)) + ".webm"
  );

  // Save video file to the desktop
  // TODO @brown-ccv #301: The outputted video is broken
  try {
    // Note the video data is sent to the main process as a base64 string
    const videoData = Buffer.from(data.split(",")[1], "base64");

    // TODO: This should already have been created?
    fs.mkdirSync(path.dirname(videoFile), { recursive: true });
    // TODO @brown-ccv #342: Convert to mp4 before final save? https://gist.github.com/AVGP/4c2ce4ab3c67760a0f30a9d54544a060
    fs.writeFileSync(videoFile, videoData);
  } catch (e) {
    log.error.error("Unable to save video file: ", videoFile);
    log.error.error(e);
  }
  log.info("Successfully saved video file: ", videoFile);
}

/********** HELPERS **********/

/**
 * Load the app into the Electron window
 * In production it loads the local bundle created by the build process
 */
function createWindow() {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    icon: "./favicon.ico",
    webPreferences: { preload: path.join(__dirname, "preload.cjs") },
    width: 1500,
    height: 900,
    // TODO @brown-ccv: Settings for preventing the menu bar from ever showing up
    menuBarVisible: IS_DEV,
    fullscreen: !IS_DEV,
  });
  if (IS_DEV) mainWindow.webContents.openDevTools();

  // Load the renderer process (index.html)
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    // TODO @brown-ccv: JsPsych protections for loading from a file://
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
  log.info("Loaded Renderer process");
}

/** Returns the absolute path to the JSON file stored in userData */
function getDataPath() {
  return path.resolve(DATA_DIR, FILE_PATH);
}

/** Returns the absolute path to the outputted JSON file */
function getOutPath() {
  return path.resolve(OUT_DIR, FILE_PATH);
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
            ...(IS_DEV ? ["Continue Anyway"] : []),
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
        ...(IS_DEV ? ["Continue Anyway"] : []),
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
