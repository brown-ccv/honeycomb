/** ELECTRON MAIN PROCESS */

const { app, BrowserWindow } = require("electron");
const path = require("node:path");
const url = require("url");

// Early exit when installing on Windows: https://www.electronforge.io/config/makers/squirrel.windows#handling-startup-events
if (require("electron-squirrel-startup")) app.quit();

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

/************ APP LIFECYCLE ***********/

/**
 * Executed when the app is initialized
 * @windows Builds the Electron window
 * @mac Builds the Electron window
 */
app.whenReady().then(() => {
  createWindow();
  setupLocalFilesNormalizerProxy();

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

/************ APP LIFECYCLE ***********/
