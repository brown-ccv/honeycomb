import taskTrial from "./taskTrial"
import { generateStartingOpts } from "../lib/taskUtils"

/**
 * Creates the series of prompts for the actual Stroop game (i.e., shows a series of color words and waits for user
 * input).
 * @param experimentConfig The experiment config.
 * @returns {any} A jsPsych trial object containing the block timeline.
 */
const taskBlock = (experimentConfig) => {
  // Creates a randomized array of the color words provided in experimentConfig.conditions. Each word is repeated the
  // same number of times.
  const startingOpts = generateStartingOpts(experimentConfig)

  // Loops through the words in startingOpts, creating a trial for each one.
  let timeline = startingOpts.map((word) => taskTrial(experimentConfig, word))

  // Trial to start the block. Saves the experiment config being used.
  let blockStart = {
    type: "html_keyboard_response",
    stimulus: "",
    trial_duration: 1,
    on_finish: (data) => data.block_settings = experimentConfig
  }

  timeline.unshift(blockStart)

  return {
    timeline: timeline
  }
}

export default taskBlock
