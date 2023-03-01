import { defaultBlockSettings } from './main';
import { deepCopy } from '../lib/utils'

import localConfig from "./config.json"
import { envConfig } from "./main"
import path from "path"
import { getFirestoreConfig } from "../firebase"

// TODO: Rename config as blockSettings
// TODO: Rename config.js as DefaultBlockSettings.json?
/**
 * Get configuration file for the experiment
 * @param {string} participantID 
 * @param {string} studyID 
 * @return {object} Block Settings used for the JsPsych experiment
 */
const getConfig = async (participantID, studyID) => {
  // Initialize experiment config as local file
  let experimentConfig = localConfig
  if (envConfig.USE_ELECTRON) {
    const app = window.require("electron").remote.app
    const renderer = window.require("electron").ipcRenderer
    const fs = window.require("fs")

    try {
      // Attempt to get new configuration settings from the desktop
      const overrideConfig = path.join(
        app.getPath("desktop"),
        `${app.getName()}-settings`,
        `${participantID}-config.json`
      )
      experimentConfig = Object.assign(experimentConfig, JSON.parse(fs.readFileSync(overrideConfig), "utf8"))
    } catch (error) {
      console.log("Using default config")
    }
    // Save experiment configuration
    renderer.send("save-config", experimentConfig, participantID, studyID)
  } else if (envConfig.USE_FIREBASE) {
    // Attempt to get new configuration settings from firebase
    const firestoreConfig = await getFirestoreConfig(studyID, participantID)
    if (firestoreConfig) experimentConfig = firestoreConfig
  } else {
    console.warn("Using default config")
  }
  return experimentConfig
}

export { getConfig }

// TODO: Why is this commented out?
/**
 * Creates a new config object, using the default settings as a baseline and overriding each one with the specific block
 * settings from the provided override object.
 * @param override The custom config to merge with the default.
 * @param defaultBlockSettings An object containing the default block settings.
 * @returns newConfig An object containing the new config settings.
 */
// const overrideSettings = (override, defaultBlockSettings) => {
//   const newBlock = deepCopy(defaultBlockSettings)
//   Object.assign(newBlock, override)
//
//   return newBlock
// }

// TODO: Why is this commented out?
/**
 * Generates an array of blocks of settings for an experiment, using a default block and an array of overrides.
 * @param defaultBlockSettings An object containing the default block settings.
 * @param {array} blockOverrides An array containing the override setting for the different experiment blocks.
 */
// const generateExperiment = (defaultBlockSettings, blockOverrides) => {
//   let newBlocks = []
//
//   for (let i = 0; i < blockOverrides.length; i++) {
//     newBlocks.push(overrideSettings(blockOverrides[i], defaultBlockSettings))
//   }
//
//   return newBlocks
// }


// TODO: BLOCK SETTINGS IN MAIN


// FIRST EXPERIMENT BLOCK SETTINGS

// Create copy of default settings for the first experiment
const exptBlock1 = deepCopy(defaultBlockSettings)
exptBlock1.repeats_per_condition = 2

// SECOND EXPERIMENT BLOCK SETTINGS

// TODO: IN MAIN
// Create copy of default settings for the second experiment
const exptBlock2 = deepCopy(defaultBlockSettings)
exptBlock2.conditions = ["e", "f"]
exptBlock2.repeats_per_condition = 2

export {
  exptBlock1,
  exptBlock2,
}
