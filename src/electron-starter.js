// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const ipc = require('electron').ipcMain
const _ = require('lodash')
const fs = require('fs')


// Event Trigger
const { eventCodes, manufacturer, vendorId, productId } = require('./config/trigger')
const { isPort, getPort, sendToPort } = require('event-marker')


const triggerPort = getPort(vendorId, productId)
const port_ = isPort(vendorId, productId)


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { nodeIntegration: true }
  })

  // and load the index.html of the app.
  const startUrl = process.env.ELECTRON_START_URL || url.format({
            pathname: path.join(__dirname, '../build/index.html'),
            protocol: 'file:',
            slashes: true
        });
  console.log(startUrl);
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

// EVENT TRIGGER
ipc.on('trigger', (event, args) => {
  let code
  try {
    code = args.value.code
  }
  catch {
    code = args.code
  }
  if (code != undefined) {
    console.log(`Event: ${_.invert(eventCodes)[code]}, code: ${code}`)
    sendToPort(triggerPort, code)
  }
})
// INCREMENTAL FILE SAVING
var stream = false

// listener for new data
ipc.on('data', (event, args) => {
  // experiment ended, add closing bracket to array
  if (args === "end") {
    stream.write(']')
    stream.end()
    stream = false
    return
  }

  // initialize file
  if (args.trial_index === 0) {
    const dir = app.getPath('userData')
    const fileName = path.resolve(dir, `pid_${args.patient_id}_${Date.now()}.json`)
    console.log(fileName)
    stream = fs.createWriteStream(fileName, {flags:'ax+'});
    stream.write('[')
  }

  // write intermediate commas
  if (args.trial_index > 0) {
    stream.write(',')
  }

  //write the data
  stream.write(JSON.stringify(args))
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

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
