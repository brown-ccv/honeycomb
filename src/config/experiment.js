import localConfig from "./config.json"
import { envConfig } from "./main"
import path from "path"
import { getFirestoreConfig } from "../firebase"

const getConfig = async (participantID, studyID) => {
  let experimentConfig = localConfig
  if (envConfig.USE_ELECTRON) {
    const app = window.require("electron").remote.app
    const renderer = window.require("electron").ipcRenderer
    const fs = window.require("fs")
    try {
      const overrideConfig = path.join(
        app.getPath("desktop"),
        `${app.getName()}-settings`,
        `${participantID}-config.json`
      )
      experimentConfig = Object.assign(experimentConfig, JSON.parse(fs.readFileSync(overrideConfig), "utf8"))
    } catch (error) {
      console.warn("Using default config")
    }
    renderer.send("save-config", experimentConfig, participantID, studyID)
  } else if (envConfig.USE_FIREBASE) {
    const firestoreConfig = await getFirestoreConfig(studyID, participantID)
    if (firestoreConfig) {
      experimentConfig = firestoreConfig
    }
  } else {
    console.warn("Using default config")
  }

  return experimentConfig
}

/*
 * The following two functions are used to create separate sets of settings for each experiment section, when relevant.
 * Since there is only one set of settings needed for this experiment, they are not used. They may be useful in more
 * complex experiments, however, where different sections of the experiment require different versions of the same
 * settings. For instance, if two different sections of this experiment needed different response_time settings, we
 * would use the following functions.
 */

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

export { getConfig }
