// Settings for saving data - only used in Electron App

// dataDir will be created on Desktop and used as root folder for saving data
// data save format is ~/Desktop/<dataDir>/<patientID>/<date>/<filename>.json
// it is also incrementally saved to the user's app data folder (logged to console)
const dataDir = 'OCD-Project-Data'

// this is module.exports isntead of just exports as it is also imported into the electron app
module.exports = {
	dataDir
}
