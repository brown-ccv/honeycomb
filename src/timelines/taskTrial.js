import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response'
import { fixation } from "@brown-ccv/behavioral-task-trials";

import { envConfig } from "../config/main";
import choice from "../trials/choice"
import showEarnings from "../trials/showEarnings"

import { getRandomInt } from "../lib/utils"
import { getConfig } from '../config/experiment';


/**
 * Sets up a Stroop trial.
 * @param experimentConfig The experiment config object.
 * @param word The color word to display for this trial.
 * @returns {any} A jsPsych trial object containing a Stroop trial timeline.
 */
// TODO: experimentConfig is in config/config (swap config/config and config/main?)
const taskTrial = async (jsPsych, word) => {
  const {participant_id, study_id} = jsPsych.data.dataProperties
  const experimentConfig = await getConfig(participant_id, study_id)

  // Set a random font color for the trial, using the colors provided in experimentConfig.
  const colors = experimentConfig.conditions
  const color = colors[getRandomInt(colors.length)]

  // Build the timeline
  let timeline = [
    // Show the fixation dot
    fixation(envConfig, {duration: 650,}),
    // Display a word and wait for user input.
    choice(word, color, experimentConfig.response_time),
    // End the trial by displaying the participant's earnings.
    showEarnings(jsPsych, 1500)
  ];

  return {
    type: htmlKeyboardResponse,
    timeline: timeline,
  };
};

export default taskTrial;
