import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { createHoneycombTrial } from "./honeycombTrial";
import { generateBlockConditions } from "../utils";

/**
 * Build a timeline block of multiple trials of Honeycomb's custom task
 * Each trial within a block contains randomized values for our experiment's configuration
 *
 * @param {number} conditions - The possible conditions to show in a given trial (default: ["a", "b", "c"])
 * @param {string} repeatsPerCondition - The number of times each condition should be repeated (default: 1)
 * @param {string} isPractice - Whether or not the block is for practice (default: false)
 * @param {number} isTutorial - Whether or not the block is a tutorial (default: false)
 * @param {number} photodiodeActive - Whether or not photodiode should be active (default: false)
 */
// TODO 210: Implement stroop game, rename as stroopBlock
export function createHoneycombBlock({
  // TODO 236: These conditions will be loaded from a config file?
  conditions = ["a", "b", "c"],
  repeatsPerCondition = 1, // number of times every condition is repeated
  isPractice = false,
  isTutorial = false,
  photodiodeActive = false,
} = {}) {
  // Create an array of the conditions to use and build into an array of trials
  const blockConditions = generateBlockConditions(conditions, repeatsPerCondition);
  const blockTrials = blockConditions.map((condition) => createHoneycombTrial(condition));

  // Create an empty trial that adds the blockConditions to the JsPsych data object
  const startingTrial = {
    type: htmlKeyboardResponse,
    stimulus: "",
    trial_duration: 1,
    on_finish: (data) => {
      data.block_settings = blockConditions;
    },
  };

  // Return the block as a single, nested, trial
  return {
    type: htmlKeyboardResponse,
    isPractice,
    isTutorial,
    photodiodeActive,
    timeline: [startingTrial, ...blockTrials],
  };
}
