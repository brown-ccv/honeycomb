/**
 * Main electron renderer processes
 */
const { app, BrowserWindow } = require("electron");
const path = require("node:path");
// const log = require("electron-log");

/** Whether or not Electron the app is in development mode */
const IS_DEV = process.env.ELECTRON_START_URL ? true : false;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let MAIN_WINDOW;

/**
 * Creates a new Electron window.
 * The window is created differently based on IS_DEV
 */
function createWindow() {
  // Create the browser window.
  if (IS_DEV) {
    // Create a new window in development mode
    console.log("Creating a window in development mode");
    MAIN_WINDOW = new BrowserWindow({
      width: 1500,
      height: 900,
      icon: "./favicon.ico",
      webPreferences: {
        // nodeIntegration: true,
        // contextIsolation: false,
      },
    });
  } else {
    // Create a new browser window in production mode
    MAIN_WINDOW = new BrowserWindow({
      // TODO: These are the navbar things? I want the "traffic lights" but nothing else?
      // TODO: Open maximized but not fullscreen? https://www.electronjs.org/docs/latest/tutorial/window-customization#create-frameless-windows
      // fullscreen: true,
      frame: false,
      icon: "./favicon.ico",
      webPreferences: {
        // nodeIntegration: true,
        // webSecurity: true,
        // contextIsolation: false,
      },
    });
  }

  // Load the app.
  const url =
    process.env.ELECTRON_START_URL || `file://${path.join(__dirname, "../build/index.html")}`;
  // log.info(url);
  MAIN_WINDOW.loadURL(url);

  // Open the DevTools if running in development mode
  if (IS_DEV) MAIN_WINDOW.webContents.openDevTools();
}

/************ EVENT HANDLERS ***********/

/**
 * Executed when the app is initialized
 * @windows Builds the Electron window
 * @mac Builds the Electron window
 */
app.whenReady().then(() => {
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
