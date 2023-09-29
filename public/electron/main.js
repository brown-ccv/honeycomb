/** ELECTRON MAIN PROCESS */

const { app, BrowserWindow, ipcMain } = require("electron");
const log = require("electron-log");
const path = require("node:path");
const fs = require("node:fs");
const url = require("url");

// Early exit when installing on Windows: https://www.electronforge.io/config/makers/squirrel.windows#handling-startup-events
if (require("electron-squirrel-startup")) app.quit();

/************ GLOBALS ***********/

// TODO: Handle trigger.js config in the same way as this, delete from public folder
// TODO: Handle data writing to desktop in a utility process?
let CONFIG; // Honeycomb configuration object
let OUT_FILE; // The data file being written to
let WRITE_STREAM; // Writeable file stream for the data

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

  setupLocalFilesNormalizerProxy();

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
// TODO: This is deprecated but needed to load the min files?
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

function handleOnDataUpdate(event, data) {
  const { participant_id, study_id, start_date } = data;

  // TODO: We should probably initialize file on login? That's how Firebase handles it
  // if (WRITE_STREAM) {
  //   const userData = app.getPath("userData");
  //   const appName = app.getName();
  //   const fileName = `${start_date}.json`.replaceAll(":", "_"); // (":" are replaced to prevent issues with invalid file names);
  //   console.log(preSavePath);
  // }
  if (OUT_FILE == undefined) {
    const desktop = app.getPath("desktop");
    const appName = app.getName();
    const fileName = `${start_date}.json`.replaceAll(":", "_"); // (":" are replaced to prevent issues with invalid file names);
    const savePath = path.resolve(desktop, appName, study_id, participant_id, fileName);

    // Initialize the writeable stream
    // TODO: Need to create and write to the file on the desktop
    // TODO: It may be easier to write to the temp folder like before
    WRITE_STREAM = fs.createWriteStream(savePath, { flags: "ax+" });
    WRITE_STREAM.write("{");

    // Write
    WRITE_STREAM.write(`version: ${GIT_VERSION}`);
  }

  // Temp - write ending
  WRITE_STREAM.write("}");
  WRITE_STREAM.end();
}

function handleOnFinish() {}
