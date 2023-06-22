import _ from 'lodash';
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import { createHoneycombTrial } from './honeycombTrial';

// TODO: Have these be default values for the function parameter?
export const defaultBlockSettings = {
  conditions: ['a', 'b', 'c'],
  repeatsPerCondition: 1, // number of times every condition is repeated
  isPractice: false,
  isTutorial: false,
  photodiodeActive: false,
};

// TODO: Should maybe delete this? Is it useful?
/**
 * Create an array of conditions for each trial of the block.
 * There will be conditions.length * repeats number of trials in the block
 * @param {object} conditions The conditions to be present, 1 trial per condition
 * @param {number} repeats The number of times to repeat each condition, 1 trial per repeat
 * @returns
 */
export function generateBlockConditions(conditions, repeats) {
  const startingOptions = conditions.map((c) => _.range(repeats).map(() => c));
  // Randomize the conditions
  return _.shuffle(_.flatten(startingOptions));
}

/**
 * Build a timeline block of multiple trials of Honeycomb's custom task
 * Each trial within a block contains randomized values for our experiment's configuration
 *
 * @param {number} conditions - The possible conditions to show in a given trial (default: ['a', 'b', 'c'])
 * @param {string} repeatsPerCondition - The number of times each condition should be repeated (default: 1)
 * @param {string} isPractice - Whether or not the block is for practice (default: false)
 * @param {number} isTutorial - Whether or not the block is a tutorial (default: false)
 * @param {number} photodiodeActive - Whether or not photodiode should be active (default: false)
 */
// TODO: Implement stroop game, rename as stroopBlock
export function createHoneycombBlock({
  // TODO: These conditions will be loaded from a config file?
  conditions = ['a', 'b', 'c'],
  repeatsPerCondition = 1, // number of times every condition is repeated
  isPractice = false,
  isTutorial = false,
  photodiodeActive = false,
} = {}) {
  // Create an array of the conditions to use and build into an array of trials
  const blockConditions = generateBlockConditions(conditions, repeatsPerCondition);
  const blockTrials = blockConditions.map((condition) => createHoneycombTrial(condition));

  // Create an empty trial that adds the blockConditions to the JsPsych data object
  // TODO: If I set the conditions in the block trial
  // TODO: If I set isPractice, isTutorial, etc will it automatically nest to the child trials?
  const startingTrial = {
    type: htmlKeyboardResponse,
    stimulus: '',
    trial_duration: 1,
    on_finish: (data) => {
      data.block_settings = blockConditions;
    },
  };

  // Return the block as a single, nested, trial
  return {
    type: htmlKeyboardResponse,
    is_practice: isPractice, // TODO: Are these valid in JsPsych?
    is_tutorial: isTutorial, // TODO: Are these valid in JsPsych?
    photodiode_active: photodiodeActive, // TODO: Are these valid in JsPsych?
    timeline: [startingTrial, ...blockTrials],
  };
}
