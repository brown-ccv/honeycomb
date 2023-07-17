// TODO 151: Can't use ES7 import statements here?

// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const ipc = require('electron').ipcMain;
const _ = require('lodash');
const fs = require('fs-extra');
const log = require('electron-log');

// Event Trigger
const { eventCodes, vendorId, productId, comName } = require('./config/trigger');
const { getPort, sendToPort } = require('event-marker');

// Prevent launching multiple instances on Windows https://www.electronforge.io/config/makers/squirrel.windows#handling-startup-events
if (require('electron-squirrel-startup')) app.quit();

// Define default environment variables
let USE_EEG = false;
let VIDEO = false;

// Override product ID if environment variable set
const activeProductId = process.env.EVENT_MARKER_PRODUCT_ID || productId;
const activeComName = process.env.EVENT_MARKER_COM_NAME || comName;
if (activeProductId) log.info('Active product ID', activeProductId);
else log.info('COM Name', activeComName);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

/**
 * Create the browser window within the Electron app
 */
function createWindow() {
  // TODO: Use REACT_APP_NODE_ENV instead of this start ELECTRON_START_URL variable
  if (process.env.ELECTRON_START_URL) {
    mainWindow = new BrowserWindow({
      width: 1500,
      height: 900,
      icon: './favicon.ico',
      webPreferences: {
        // Note we disable web security, allows local file loading
        nodeIntegration: true,
        contextIsolation: false,
      },
    });
  } else {
    mainWindow = new BrowserWindow({
      fullscreen: true,
      icon: './favicon.ico',
      frame: false,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: true,
        contextIsolation: false,
      },
    });
  }

  // Load the index.html of the app.
  const startUrl =
    process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../build/index.html')}`;
  log.info(startUrl);
  mainWindow.loadURL(startUrl);

  // Open the DevTools in dev mode
  if (process.env.ELECTRON_START_URL) mainWindow.webContents.openDevTools();

  // Dereference the window object, emitted when the window is closed
  mainWindow.on('closed', () => (mainWindow = null));
}

// TRIGGER PORT HELPERS
let triggerPort;
let portAvailable;
let SKIP_SENDING_DEV = false;

/**
 * Sets up the correct ports needed for the event triggers to communicate with electron
 */
async function setUpPort() {
  let port;
  if (activeProductId) port = await getPort(vendorId, activeProductId);
  else port = await getPort(activeComName);

  if (port) {
    triggerPort = port;
    portAvailable = true;

    triggerPort.on('error', (err) => {
      log.error(err);
      const buttons = ['OK'];

      // Always continue in dev mode
      if (process.env.ELECTRON_START_URL) buttons.push('Continue Anyway');

      dialog
        .showMessageBox(mainWindow, {
          type: 'error',
          message: 'Error communicating with event marker.',
          title: 'Task Error',
          buttons,
          defaultId: 0,
        })
        .then((opt) => {
          if (opt.response === 0) {
            app.exit();
          } else {
            SKIP_SENDING_DEV = true;
            portAvailable = false;
            triggerPort = false;
          }
        });
    });
  } else {
    triggerPort = false;
    portAvailable = false;
  }
}

/**
 * Send events between the Event Marker and electron
 * @param {*} code
 */
function handleEventSend(code) {
  if (!portAvailable && !SKIP_SENDING_DEV) {
    const message = 'Event Marker not connected';
    log.warn(message);

    const buttons = ['Quit', 'Retry'];
    if (process.env.ELECTRON_START_URL) {
      buttons.push('Continue Anyway');
    }
    dialog
      .showMessageBox(mainWindow, {
        type: 'error',
        message,
        title: 'Task Error',
        buttons,
        defaultId: 0,
      })
      .then((resp) => {
        const opt = resp.response;
        if (opt === 0) {
          // quit
          app.exit();
        } else if (opt === 1) {
          // retry
          setUpPort().then(() => handleEventSend(code));
        } else if (opt === 2) {
          SKIP_SENDING_DEV = true;
        }
      });
  } else if (!SKIP_SENDING_DEV) {
    sendToPort(triggerPort, code);
  }
}

/**
 * Update env variables with build-time values from frontend
 */
ipc.on('updateEnvironmentVariables', (event, args) => {
  USE_EEG = args.USE_EEG;
  VIDEO = args.USE_CAMERA;
  if (USE_EEG) {
    setUpPort().then(() => handleEventSend(eventCodes.test_connect));
  }
});

/**
 * Event triggered
 */
ipc.on('trigger', (event, args) => {
  const code = args;
  if (code !== undefined) {
    log.info(`Event: ${_.invert(eventCodes)[code]}, code: ${code}`);
    if (USE_EEG) handleEventSend(code);
  }
});

// <studyID> will be created on Desktop and used as root folder for saving data.
// data save format is ~/Desktop/<studyID>/<participantID>/<date>/<filename>.json
// it is also incrementally saved to the user's app data folder (logged to console)

// INCREMENTAL FILE SAVING
// TODO 192: These should be ALL_CAPS
let stream = false;
let fileCreated = false;
let preSavePath = '';
let savePath = '';
let participantID = '';
let studyID = '';
const images = [];
let startTrial = -1;
const today = new Date();
// Read version file (git sha and branch)
const git = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config/version.json')));

/**
 * Abstracts constructing the filepath for saving data for this participant and study.
 * @returns {string} The filepath.
 */
function getSavePath(studyID, participantID) {
  if (studyID !== '' && participantID !== '') {
    const desktop = app.getPath('desktop');
    const name = app.getName();
    const date = today.toISOString().slice(0, 10);
    return path.join(desktop, studyID, participantID, date, name);
  }
}

/**
 * Returns the complete path to a file
 * @param fileName the name of the file to be saved
 * @returns string
 */
// TODO 192: Can we  move this to utils? Separate within this file?
function getFullPath(fileName) {
  return path.join(savePath, fileName);
}

/**
 * Sync participantID and studyID from the environment variables
 */
// TODO 192: Can this be synced with URL search params like on the browser?
ipc.on('syncCredentials', (event) => {
  event.returnValue = {
    envParticipantId: process.env.REACT_APP_PARTICIPANT_ID,
    envStudyId: process.env.REACT_APP_STUDY_ID,
  };
});

/**
 * Event fired when new data is created
 */
ipc.on('data', (event, args) => {
  // initialize file - we got a participant_id to save the data to
  if (args.study_id && args.participant_id && !fileCreated) {
    const dir = app.getPath('userData');
    participantID = args.participant_id;
    studyID = args.study_id;
    preSavePath = path.resolve(dir, `pid_${participantID}_${today.getTime()}.json`);
    startTrial = args.trial_index;
    log.warn(preSavePath);
    stream = fs.createWriteStream(preSavePath, { flags: 'ax+' });
    stream.write('[');
    fileCreated = true;
  }

  // TODO 192: Why is this outside the above if?
  // TODO 192: Can we start savePath as undefined?
  if (savePath === '') savePath = getSavePath(studyID, participantID);

  // we have a set up stream to write to, write to it!
  if (stream) {
    // Add commas between trials
    if (args.trial_index > startTrial) stream.write(',');

    // write the data
    stream.write(JSON.stringify({ ...args, git }));

    // Copy provocation images to participant's data folder
    if (args.trial_type === 'image-keyboard-response') images.push(args.stimulus.slice(7));
  }
});

/**
 * Save the video file
 */
ipc.on('save_video', (event, videoFileName, buffer) => {
  // TODO 192: Can we start savePath as undefined?
  if (savePath === '') savePath = getSavePath(studyID, participantID);

  if (VIDEO) {
    const fullPath = getFullPath(videoFileName);
    fs.outputFile(fullPath, buffer, (err) => {
      if (err) {
        event.sender.send('ERROR', err.message);
      } else {
        event.sender.send('SAVED_FILE', fullPath);
        console.log(fullPath);
      }
    });
  }
});

/**
 * Quit the app when the experiment ends
 */
ipc.on('end', () => app.quit());

/**
 * Handle errors sent from front end to back end
 */
ipc.on('error', (event, args) => {
  log.error(args);
  const buttons = ['OK'];

  // Always continue while in dev mode
  if (process.env.ELECTRON_START_URL) buttons.push('Continue Anyway');

  const opt = dialog.showMessageBoxSync(mainWindow, {
    type: 'error',
    message: args,
    title: 'Task Error',
    buttons,
  });

  if (opt === 0) app.exit();
});

/**
 * Handle any uncaught exceptions
 */
process.on('uncaughtException', (error) => {
  // Handle the error
  log.error(error);

  // Display a separate dialog box while in production
  if (!process.env.ELECTRON_START_URL) {
    dialog.showMessageBoxSync(mainWindow, { type: 'error', message: error, title: 'Task Error' });
  }
});

/**
 * Called when Electron finishes initializing
 */
app.on('ready', () => createWindow());

/**
 * Called when all app windows are closed
 */
app.on('window-all-closed', function () {
  // Quit the app unless on macOS ('darwin')
  // On mac it's common for applications to stay active until the user quits explicitly
  if (process.platform !== 'darwin') app.quit();
});

/**
 * Called when an app window is activated
 */
app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

/**
 * Cleanup function after app.quit() or user quits explicity
 */
app.on('will-quit', () => {
  if (fileCreated) {
    // finish writing file
    stream.write(']');
    stream.end();
    stream = false;

    // copy file to config location
    fs.mkdir(savePath, { recursive: true }, (err) => {
      log.error(err);
      fs.copyFileSync(preSavePath, getFullPath(`pid_${participantID}_${today.getTime()}.json`));
    });
  }
});
