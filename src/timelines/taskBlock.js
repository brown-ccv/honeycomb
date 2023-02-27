import taskTrial from "./taskTrial"
import { generateStartingOptions } from "../lib/taskUtils"

/**
 * Creates the series of prompts for the actual Stroop game 
 * (i.e., shows a series of color words and waits for user input).
 * @param experimentConfig The experiment config.
 * @returns {any} A jsPsych trial object containing the block timeline.
 */
const taskBlock = (experimentConfig) => {
  // Creates a randomized array of the color words provided in experimentConfig.conditions.
  // Each word is repeated the same number of times.
  const options = generateStartingOptions(experimentConfig)

  // Loops through the words in startingOpts, creating a trial for each one.
  let timeline = options.map((word) => taskTrial(experimentConfig, word))

  // Trial to start the block. Saves the experiment config being used.
  const blockStart = {
    type: "html_keyboard_response",
    stimulus: "",
    trial_duration: 1,
    on_finish: (data) => data.block_settings = experimentConfig
  }

  timeline.unshift(blockStart)
  return {timeline}
}

export default taskBlock
