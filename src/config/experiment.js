import { deepCopy } from '../lib/utils'
import localConfig from './config.json'
import { envConfig } from "./main"
import path from "path"

const getConfig = async (participantID, studyID) => {
  let experimentConfig = localConfig
  if (envConfig.USE_ELECTRON ) {
    const app = window.require("electron").remote.app
    const renderer = window.require("electron").ipcRenderer;
    const fs = window.require("fs")
    try {
      const overrideConfig = path.join(
        app.getPath("desktop"),
        `${app.getName()}-settings`,
        `${participantID}-config.json`
      );
      experimentConfig = Object.assign(experimentConfig, JSON.parse(fs.readFileSync(overrideConfig), "utf8"));
    } catch (error) {
      console.warn("Using default config")
    }
    renderer.send("save-config", experimentConfig, participantID, studyID)
  } else {
    console.warn("Using default config")
  }

  return generateExperiment(experimentConfig)
}

/**
 * Creates config objects for each of the four types of blocks, using the default settings as a
 * baseline and overriding each one with the specific block settings from the config JSON file.
 * @param {JSON} override The custom config to merge with the default.
 * @param {any} defaultBlockSettings An object containing the default block settings.
 * @returns An object containing the block's config settings.
 */
const overrideSettings = (override, defaultBlockSettings) => {
  console.log("Default block settings:", defaultBlockSettings)
  console.log("override:", override)
  const newBlock = deepCopy(defaultBlockSettings);
  Object.assign(newBlock, override);

  return newBlock;
};

const generateExperiment = (config) => {
  let { defaultBlockSettings, tutorialBlock, practiceBlock, exptBlock1, exptBlock2 } = config

  tutorialBlock = overrideSettings(tutorialBlock, defaultBlockSettings)
  practiceBlock = overrideSettings(practiceBlock, defaultBlockSettings)
  exptBlock1 = overrideSettings(exptBlock1, defaultBlockSettings)
  exptBlock2 = overrideSettings(exptBlock2, defaultBlockSettings)

  return { tutorialBlock, practiceBlock, exptBlock1, exptBlock2}
}

export { getConfig }
