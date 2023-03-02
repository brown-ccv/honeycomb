import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response'

import taskTrial from "./taskTrial";
import { generateStartingOpts } from "../lib/taskUtils";
import { getConfig } from "../config/experiment";


/**
 * Build the block settings for the task
 * 
 * Stroop:
 * Shows a series of color words and waits for user input
 * 
 * @param experimentConfig Configuration object for the experiment
 * @returns {any} A jsPsych trial object containing the block timeline.
 */
const taskBlock = async (jsPsych) => {
  const {participant_id, study_id} = jsPsych.data.dataProperties
  const experimentConfig = await getConfig(participant_id, study_id)

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
  const timeline = await Promise.all(startingOptions.map((word) => taskTrial(jsPsych, word)));

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
    type: htmlKeyboardResponse,
    stimulus: "",
    trial_duration: 1,
    on_finish: (data) => (data.block_settings = experimentConfig),
		timeline: timeline
	}
};

export default taskBlock;
