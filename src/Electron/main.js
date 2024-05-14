/** ELECTRON MAIN PROCESS */

import path from "node:path";
import fs from "node:fs";
import { app, BrowserWindow, ipcMain, dialog } from "electron";
import log from "electron-log";
import _ from "lodash";

// TODO @RobertGemmaJr: Figure out how to install the dev tools
// import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

// const { getPort, sendToPort } = require("./serialPort");

// TODO @RobertGemmaJr: Do more testing with the environment variables - are home/clinic being built correctly?
// TODO @brown-ccv #460: Add serialport's MockBinding for the "Continue Anyway": https://serialport.io/docs/guide-testing

// TODO @brown-ccv #192: Handle data writing to desktop in a utility process
// TODO @brown-ccv #192: Handle video data writing to desktop in a utility process
// TODO @brown-ccv #398: Separate log files for each run through
// TODO @brown-ccv #429: Use app.getPath('temp') for temporary JSON file

/************ GLOBALS ***********/

// These global variables are created by electron-forge
/* global MAIN_WINDOW_VITE_DEV_SERVER_URL */
/* global MAIN_WINDOW_VITE_NAME */

// TODO: Handle version in renderer - pass into jspsych?
// TODO: Just handle the commit id? I think that's probably fine
const GIT_VERSION = JSON.parse(fs.readFileSync(path.resolve(__dirname, "version.json")));
const IS_DEV = import.meta.env.DEV && !app.isPackaged;

let CONFIG; // Honeycomb configuration object
let CONTINUE_ANYWAY; // Whether to continue the experiment with no hardware connected (option is only available in dev mode)

let TEMP_FILE; // Path to the temporary output file
let OUT_PATH; // Path to the final output folder (on the Desktop)
let OUT_FILE; // Name of the final output file

let TRIGGER_CODES; // Trigger codes and IDs for the EEG machine
let TRIGGER_PORT; // Port that the EEG machine is talking through

// TODO: Fix the security policy instead of ignoring
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

/************ APP LIFECYCLE ***********/

// Early exit when installing on Windows: https://www.electronforge.io/config/makers/squirrel.windows#handling-startup-events
if (require("electron-squirrel-startup")) app.quit();

// Initialize the logger
// TODO: Spy on the renderer process too?
log.initialize({ preload: true });

/**
 * Executed when the app is initialized
 * @windows Builds the Electron window
 * @mac Builds the Electron window
 */
app.whenReady().then(() => {
  log.info("App Ready: ", app.name);

  // Installs the react developer tools extension
  // installExtension
  //   .installExtension(installExtension.REACT_DEVELOPER_TOOLS)
  //   .then((name) => console.info(`Added Extension:  ${name}`))
  //   .catch((err) => console.info("An error occurred: ", err));

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
  log.info("Loaded Renderer Process");
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

// TODO: SERPATE SERIAL PORT FILE

const SerialPort = require("serialport");

// TODO @brown-ccv #460: Test connections with MockBindings (e.g. CONTINUE_ANYWAY)  https://serialport.io/docs/api-binding-mock

/**
 * Retrieve's a serial port device based on either the COM name or product identifier
 * If productID is undefined then comVendorName is the COM name, otherwise it's the vendorID
 * @param {Array} portList A list of available serial port devices
 * @param {string} comVendorName EITHER a com name or the vendor identifier of the desired device
 * @param {string | undefined} productId The product identifier of the desired device
 * @returns The SerialPort device
 */
function getDevice(portList, comVendorName, productId) {
  if (productId === undefined) {
    const comName = comVendorName;
    return portList.filter(
      // Find the device with the matching comName
      (device) => device.comName === comName.toUpperCase() || device.comName === comName
    );
  } else {
    const vendorId = comVendorName;
    return portList.filter(
      // Find the device with the matching vendorId and productId
      (device) =>
        (device.vendorId === vendorId.toUpperCase() || device.vendorId === vendorId) &&
        device.productId === productId
    );
  }
}

/**
 * Retrieve's a serial port device based on either the COM name or product identifier
 * Returns false if the desired device was not found
 * @param {string} comVendorName EITHER a com name or the vendor identifier of the desired device
 * @param {string | undefined} productId The product identifier of the desired device
 * @returns The SerialPort device
 */
// TODO @brown-ccv #460: This should fail, not return false
async function getPort(comVendorName, productId) {
  let portList;
  try {
    portList = await SerialPort.list();
  } catch {
    return false;
  }

  const device = getDevice(portList, comVendorName, productId);
  try {
    const path = device[0].comName;
    const port = new SerialPort(path);
    return port;
  } catch {
    return false;
  }
}

/**
 * Sends event code data to a serial port device
 * @param {SerialPort} port A SerialPort device
 * @param {number} event_code The numeric code to write to the device
 */
async function sendToPort(port, event_code) {
  port.write(Buffer.from([event_code]));
}
