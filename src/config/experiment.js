import { defaultBlockSettings, envConfig } from './main';
import localConfig from "./config.js"
import { deepCopy } from '../lib/utils'
import { getFirestoreConfig } from "../firebase"

/**
 * Get configuration file for the experiment
 * @param {string} participantID 
 * @param {string} studyID 
 * @return {object} Block Settings used for the JsPsych experiment
 */
const getConfig = async(participantID, studyID) => {
  // Initialize experiment config as local file
  // TODO: USING ELECTRON AND FIREBASE ARE NOT MUTUALLY EXCLUSIVE
  let experimentConfig = localConfig
  if (envConfig.USE_ELECTRON) {
    const { ipcRenderer } = window.require('electron')


    // TODO: Can this feature be disabled? It never made it's way into main
    // const app = window.require("electron").remote.app
    // const renderer = window.require("electron").ipcRenderer
    // const fs = window.require("fs")
    // try {
    //   const overrideConfig = path.join(
    //     app.getPath("desktop"),
    //     `${app.getName()}-settings`,
    //     `${participantID}-config.json`
    //   )
    //   experimentConfig = Object.assign(experimentConfig, JSON.parse(fs.readFileSync(overrideConfig), "utf8"))
    // } catch (error) {
    //   console.log("Using default config")
    // }

    // Save experiment configuration
    ipcRenderer.send("save-config", experimentConfig, participantID, studyID)
  } else if (envConfig.USE_FIREBASE) {
    // Attempt to get new configuration settings from firebase
    const firestoreConfig = await getFirestoreConfig(studyID, participantID)
    if (firestoreConfig) experimentConfig = firestoreConfig
    else console.warn("Using default config")
  }
  return experimentConfig
}

export { getConfig }

// TODO: Can these be deleted now that we're using stroop? exptBlock1 and exptBlock2

// FIRST EXPERIMENT BLOCK SETTINGS

// Create copy of default settings for the first experiment
const exptBlock1 = deepCopy(defaultBlockSettings)
exptBlock1.repeats_per_condition = 2

// SECOND EXPERIMENT BLOCK SETTINGS

// Create copy of default settings for the second experiment
const exptBlock2 = deepCopy(defaultBlockSettings)
exptBlock2.conditions = ["e", "f"]
exptBlock2.repeats_per_condition = 2

export {
  exptBlock1,
  exptBlock2,
}
