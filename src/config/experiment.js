import localConfig from "./config.json"
import { envConfig } from "./main"
import path from "path"
import { firestoreConfig } from "../firebase"

const getLocalConfig = async (participantID, studyID) => {
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
    const newConfig = await firestoreConfig(studyID, participantID);
    if (newConfig) {
      experimentConfig = newConfig;
    }
  } else {
    console.warn("Using default config")
  }

  return experimentConfig
}

/*
 * The following two functions are not used in this project, but may be useful in some experiments with different
 * settings for different experiment blocks.
 */

/**
 * Creates config objects for each of the four types of blocks, using the default settings as a
 * baseline and overriding each one with the specific block settings from the config JSON file.
 * @param {JSON} override The custom config to merge with the default.
 * @param {any} defaultBlockSettings An object containing the default block settings.
 * @returns An object containing the block's config settings.
 */
// const overrideSettings = (override, defaultBlockSettings) => {
//   console.log("Default block settings:", defaultBlockSettings)
//   console.log("override:", override)
//   const newBlock = deepCopy(defaultBlockSettings)
//   Object.assign(newBlock, override)
//
//   return newBlock
// }

// const generateExperiment = (config) => {
//   let { defaultBlockSettings, tutorialBlock, practiceBlock, exptBlock1, exptBlock2 } = config
//
//   tutorialBlock = overrideSettings(tutorialBlock, defaultBlockSettings)
//   practiceBlock = overrideSettings(practiceBlock, defaultBlockSettings)
//   exptBlock1 = overrideSettings(exptBlock1, defaultBlockSettings)
//   exptBlock2 = overrideSettings(exptBlock2, defaultBlockSettings)
//
//   return { tutorialBlock, practiceBlock, exptBlock1, exptBlock2 }
// }

export { getLocalConfig }
