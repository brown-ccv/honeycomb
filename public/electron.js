// handle windows installer set up
if(require('electron-squirrel-startup')) return 

// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog } = require('electron')
const path = require('path')
const ipc = require('electron').ipcMain
const _ = require('lodash')
const fs = require('fs-extra')
const log = require('electron-log');

// Define default environment variables
let USE_EEG = false
let VIDEO = false

// Event Trigger
const { eventCodes, vendorId, productId, comName } = require('./config/trigger')
const { getPort, sendToPort } = require('event-marker')

// Override product ID if environment variable set
const activeProductId = process.env.EVENT_MARKER_PRODUCT_ID || productId
const activeComName = process.env.EVENT_MARKER_COM_NAME || comName
if (activeProductId) {
  log.info("Active product ID", activeProductId)
} else {
  log.info("COM Name", activeComName)
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  if (process.env.ELECTRON_START_URL) { // in dev mode, disable web security to allow local file loading
    mainWindow = new BrowserWindow({
      width: 1500,
      height: 900,
      icon: './favicon.ico',
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false
      }
    })
  } else {
    mainWindow = new BrowserWindow({
      fullscreen: true,
      icon: './favicon.ico',
      frame: false,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: true
      }
    })
  }

  // and load the index.html of the app.
  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../build/index.html')}`
  log.info(startUrl);
  mainWindow.loadURL(startUrl);

  // Open the DevTools.
  process.env.ELECTRON_START_URL && mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// TRIGGER PORT HELPERS
let triggerPort
let portAvailable
let SKIP_SENDING_DEV = false

const setUpPort = async () => {
  let p
  if (activeProductId){
    p = await getPort(vendorId, activeProductId)
  } else {
    p = await getPort(activeComName)
  }
  if (p) {
    triggerPort = p
    portAvailable = true

    triggerPort.on('error', (err) => {
      log.error(err)
      let buttons = ["OK"]
      if (process.env.ELECTRON_START_URL) {
        buttons.push("Continue Anyway")
      }
      dialog.showMessageBox(mainWindow, {type: "error", message: "Error communicating with event marker.", title: "Task Error", buttons: buttons, defaultId: 0})
        .then((opt) => {
          if (opt.response === 0) {
            app.exit()
          } else {
            SKIP_SENDING_DEV = true
            portAvailable = false
            triggerPort = false
          }
        })
    })
  } else {
    triggerPort = false
    portAvailable = false
  }
}

const handleEventSend = (code) => {
  if (!portAvailable && !SKIP_SENDING_DEV) {
    let message = "Event Marker not connected"
    log.warn(message)

    let buttons = ["Quit", "Retry"]
    if (process.env.ELECTRON_START_URL) {
      buttons.push("Continue Anyway")
    }
    dialog.showMessageBox(mainWindow, {type: "error", message: message, title: "Task Error", buttons: buttons, defaultId: 0})
      .then((resp) => {
        let opt = resp.response
        if (opt === 0) { // quit
          app.exit()
        } else if (opt === 1) { // retry
          setUpPort()
          .then(() => handleEventSend(code))
        } else if (opt === 2) {
          SKIP_SENDING_DEV = true
        }
      })

  } else if (!SKIP_SENDING_DEV) {
    sendToPort(triggerPort, code)
  }
}

// Update env variables with buildtime values from frontend
ipc.on('updateEnvironmentVariables', (event, args) => {
  USE_EEG = args.USE_EEG
  VIDEO = args.USE_CAMERA
  if(USE_EEG) {
    setUpPort()
    .then(() => handleEventSend(eventCodes.test_connect))
  }
})


// EVENT TRIGGER

ipc.on('trigger', (event, args) => {
  let code = args
  if (code !== undefined) {
    log.info(`Event: ${_.invert(eventCodes)[code]}, code: ${code}`)
     if (USE_EEG) {
       handleEventSend(code)
     }
  }
})

// <studyID> will be created on Desktop and used as root folder for saving data.
// data save format is ~/Desktop/<studyID>/<participantID>/<date>/<filename>.json
// it is also incrementally saved to the user's app data folder (logged to console)

// INCREMENTAL FILE SAVING
let stream = false
let fileCreated = false
let preSavePath = ''
let savePath = ''
let participantID = ''
let studyID = ''
let images = []
let startTrial = -1
let today = new Date()

/**
 * Abstracts constructing the filepath for saving data for this participant and study.
 * @returns {string} The filepath.
 */
const getSavePath = (participantID, studyID) => {
  if (participantID !== "" && studyID !== "") {
    const desktop = app.getPath('desktop')
    const name = app.getName()
    const date = today.toISOString().slice(0, 10)
    return path.join(
      desktop,
      studyID,
      participantID,
      date,
      name
    )
  }
}

const getFullPath = (fileName) => {
  return path.join(savePath, fileName)
}

// Read version file (git sha and branch)
let git = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config/version.json')));

// Get Participant Id and Study Id from environment
ipc.on('syncCredentials', (event) => {
  event.returnValue = {envParticipantId: process.env.REACT_APP_PARTICIPANT_ID, envStudyId: process.env.REACT_APP_STUDY_ID}
})

// listener for new data
ipc.on('data', (event, args) => {

  // initialize file - we got a participant_id to save the data to
  if (args.participant_id && args.study_id && !fileCreated) {
    const dir = app.getPath('userData')
    participantID = args.participant_id
    studyID = args.study_id
    preSavePath = path.resolve(dir, `pid_${participantID}_${today.getTime()}.json`)
    startTrial = args.trial_index
    log.warn(preSavePath)
    stream = fs.createWriteStream(preSavePath, {flags:'ax+'});
    stream.write('[')
    fileCreated = true
  }

  if (savePath === "") {
    savePath = getSavePath(participantID, studyID)
  }

  // we have a set up stream to write to, write to it!
  if (stream) {
    // write intermediate commas
    if (args.trial_index > startTrial) {
      stream.write(',')
    }

    //write the data
    stream.write(JSON.stringify({...args, git}))

    // Copy provocation images to participant's data folder
    if (args.trial_type === "image-keyboard-response") images.push(args.stimulus.slice(7))
  }
})

// Save Video
ipc.on('save_video', (event, videoFileName, buffer) => {
  if (savePath === "") {
    savePath = getSavePath(participantID, studyID)
  }

  if (VIDEO){
    const fullPath = getFullPath(videoFileName)
    fs.outputFile(fullPath, buffer, err => {
      if (err) {
          event.sender.send(ERROR, err.message)
      } else {
        event.sender.send('SAVED_FILE', fullPath)
        console.log(fullPath)
      }
  })
  }
  
})


// EXPERIMENT END
ipc.on('end', () => {
  // quit app
  app.quit()
})

// Error state sent from front end to back end (e.g. wrong number of images)
ipc.on('error', (event, args) => {
  log.error(args)
  let buttons = ["OK"]
  if (process.env.ELECTRON_START_URL) {
    buttons.push("Continue Anyway")
  }
  const opt = dialog.showMessageBoxSync(mainWindow, {type: "error", message: args, title: "Task Error", buttons: buttons})

  if (opt === 0) app.exit()
})


// log uncaught exceptions
process.on('uncaughtException', (error) => {
    // Handle the error
    log.error(error)

    // this isn't dev, throw up a dialog
    if (!process.env.ELECTRON_START_URL) {
      dialog.showMessageBoxSync(mainWindow, {type: "error", message: error, title: "Task Error"})
    }
})


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
})
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// EXPERIMENT END
app.on('will-quit', () => {
  if (fileCreated) {// finish writing file
    stream.write("]")
    stream.end()
    stream = false

    // copy file to config location
    fs.mkdir(savePath, { recursive: true }, (err) => {
      log.error(err)
      fs.copyFileSync(preSavePath, getFullPath(`pid_${participantID}_${today.getTime()}.json`))
    })
  }
})
