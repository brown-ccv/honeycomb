import taskTrial from "./taskTrial";
import { generateStartingOpts } from "../lib/taskUtils";


/**
 * Build the block settings for the task
 * 
 * Stroop:
 * Shows a series of color words and waits for user input
 * 
 * @param experimentConfig Configuration object for the experiment
 * @returns {any} A jsPsych trial object containing the block timeline.
 */
const taskBlock = (experimentConfig) => {
  /**
   * Generate the starting options for the block
   *
   * Stroop:
   * Create a randomized array of the color words provided in experimentConfig.conditions.
   * Each word is repeated the same number of times.
   */
  const startingOptions = generateStartingOpts(experimentConfig);

  /**
   * Create the timeline for the block
   * 
   * Stroop:
   * Create a trial for each individual word in startingOptions
   */
  const timeline = startingOptions.map((word) => taskTrial(experimentConfig, word));

  // Trial to start the block. Saves the experiment config being used on finish.
  // const blockStart = {
  //   type: "html_keyboard_response",
  //   stimulus: "",
  //   trial_duration: 1,
  //   on_finish: (data) => (data.block_settings = experimentConfig),
  // };
  // timeline.unshift(blockStart);

  // Return task block
  return {
    type: "html_keyboard_response",
    stimulus: "",
    trial_duration: 1,
    on_finish: (data) => (data.block_settings = experimentConfig),
		timeline: timeline
	}
};

export default taskBlock;
