// handle windows installer set up
if(require('electron-squirrel-startup')) return

// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog } = require('electron')
const path = require('path')
const url = require('url')
const ipc = require('electron').ipcMain
const _ = require('lodash')
const fs = require('fs')
const log = require('electron-log');

const AT_HOME = (process.env.REACT_APP_AT_HOME === 'true')
// Event Trigger
const { eventCodes, manufacturer, vendorId, productId } = require('./config/trigger')
const { isPort, getPort, sendToPort } = require('event-marker')

// Override product ID if environment variable set
const activeProductId = process.env.EVENT_MARKER_PRODUCT_ID || productId
log.info("Active product ID", activeProductId)

// Data Saving
const { dataDir } = require('./config/saveData')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  if (AT_HOME) {
    log.info('Task "at home" version.')
  }
  else {
    log.info('Task "clinic" version.')
  }
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
  const startUrl = process.env.ELECTRON_START_URL || url.format({
            pathname: path.join(__dirname, '../build/index.html'),
            protocol: 'file:',
            slashes: true
        });
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
  p = await getPort(vendorId, activeProductId)
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
          if (opt.response == 0) {
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
        if (opt == 0) { // quit
          app.exit()
        } else if (opt == 1) { // retry
          setUpPort()
          .then(() => handleEventSend(code))
        } else if (opt == 2) {
          SKIP_SENDING_DEV = true
        }
      })

  } else if (!SKIP_SENDING_DEV) {
    sendToPort(triggerPort, code)
  }
}

// EVENT TRIGGER

ipc.on('trigger', (event, args) => {
  let code = args
  if (code != undefined) {
    log.info(`Event: ${_.invert(eventCodes)[code]}, code: ${code}`)
     if (!AT_HOME) {
       handleEventSend(code)
     }
  }
})

// INCREMENTAL FILE SAVING
let stream = false
let fileName = ''
let filePath = ''
let patientID = ''
let images = []
let startTrial = -1

// listener for new data
ipc.on('data', (event, args) => {

  // initialize file - we got a patinet_id to save the data to
  if (args.patient_id && fileName === '') {
    const dir = app.getPath('userData')
    patientID = args.patient_id
    fileName = `pid_${patientID}_${Date.now()}.json`
    filePath = path.resolve(dir, fileName)
    startTrial = args.trial_index
    log.warn(filePath)
    stream = fs.createWriteStream(filePath, {flags:'ax+'});
    stream.write('[')
  }

  // we have a set up stream to write to, write to it!
  if (stream) {
    // write intermediate commas
    if (args.trial_index > startTrial) {
      stream.write(',')
    }

    //write the data
    stream.write(JSON.stringify(args))

    // Copy provocation images to patient's data folder
    if (args.trial_type === 'image_keyboard_response') images.push(args.stimulus.slice(7))
  }
})

// EXPERIMENT END
ipc.on('end', (event, args) => {
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

  if (opt == 0) app.exit()
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
  if (!AT_HOME) {
    setUpPort()
    .then(() => handleEventSend(eventCodes.test_connect))
  }
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
  // finish writing file
  stream.write(']')
  stream.end()
  stream = false

  // copy file to config location
  const desktop = app.getPath('desktop')
  const name = app.getName()
  const today = new Date(Date.now())
  const date = today.toISOString().slice(0,10)
  const copyPath = path.join(desktop, dataDir, `${patientID}`, date, name)
  fs.mkdir(copyPath, { recursive: true }, (err) => {
    log.error(err)
    fs.copyFileSync(filePath, path.join(copyPath, fileName))

  })
})
