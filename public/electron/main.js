/** ELECTRON MAIN PROCESS */

const { app, BrowserWindow, ipcMain } = require("electron");
const log = require("electron-log");
const path = require("node:path");
const fs = require("node:fs");
const url = require("url");

// Early exit when installing on Windows: https://www.electronforge.io/config/makers/squirrel.windows#handling-startup-events
if (require("electron-squirrel-startup")) app.quit();

// Initialize the logger for any renderer process
log.initialize({ preload: true });

// TODO: Handle trigger.js config in the same way as this, delete from public folder
// TODO: Initialize writeable stream on login
// TODO: Handle data writing to desktop in a utility process?
// TODO: Handle video data writing to desktop in a utility process?
// TODO: Separate log files for each run through?

/************ GLOBALS ***********/

let CONFIG; // Honeycomb configuration object
let WRITE_STREAM; // Writeable file stream for the data (in the user's appData folder)
let OUT_PATH; // Path to the final output file (on the Desktop)
let OUT_FILE; // Name of the output file
// let OUT_VIDEO_FILE; // Name of the video output file

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
  ipcMain.handle("getCredentials", handleGetCredentials);
  ipcMain.on("onDataUpdate", handleOnDataUpdate);
  ipcMain.on("onFinish", handleOnFinish);
  ipcMain.on("photodiodeTrigger", handlePhotoDiodeTrigger);
  ipcMain.on("saveVideo", handleSaveVideo);

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

/** Prevents navigation outside of known pages */
// TODO: This is super useful but end user will have to enter their live website?
// const allowedNavigationDestinations = "https://my-electron-app.com";
// app.on("web-contents-created", (event, contents) => {
//   contents.on("will-navigate", (event, navigationUrl) => {
//     const parsedUrl = new URL(navigationUrl);

//     if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
//       event.preventDefault();
//     }
//   });
// });

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
  // TODO: I'm not sure this isPackaged is returning true/false correctly?
  const appURL = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
    : process.env.ELECTRON_START_URL;
  log.info("Loading URL: ", appURL);
  mainWindow.loadURL(appURL);

  // Maximize the window in production
  if (app.isisPackaged) mainWindow.maximize();
  // Open the dev tools in development
  else mainWindow.webContents.openDevTools();
}

/**
 * Set up a local proxy to adjust the paths of requested files
 * when loading them from the production bundle (e.g. local fonts, etc...).
 */
function setupLocalFilesNormalizerProxy() {
  // TODO: This is deprecated but needed to load the min files? https://www.electronjs.org/docs/latest/api/protocol#protocolhandlescheme-handler
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

function handlePhotoDiodeTrigger() {
  log.info("PHOTODIODE TRIGGER");
}

// Data is sent as a base64 encoded string
function handleSaveVideo(event, data) {
  console.log("ELECTRON", data);
  const filePath = path.resolve(OUT_PATH, `video.webm`);
  if (CONFIG.USE_VIDEO) {
    try {
      fs.mkdirSync(OUT_PATH, { recursive: true });
      // Save video file to the desktop
      // fs.outputFile(filePath, buffer, (err) => {
      //   if (err) {
      //     event.sender.send("ERROR", err.message);
      //   } else {
      //     event.sender.send("SAVED_FILE", filePath);
      //     console.log(filePath);
      //   }
      // });
      // fs.outputFileSync(filePath, buffer);
    } catch (e) {
      event.sender.send("ERROR", e.message); // TEMP?
      log.error.error("Unable to save file: ", filePath);
      log.error.error(e);
    }
    log.info("Successfully saved video file to ", filePath);
  }
}
