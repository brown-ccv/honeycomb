// import trials
import { fixation } from "@brown-ccv/behavioral-task-trials";
import { envConfig } from "../config/main";
import choice from "../trials/choice"
import { getRandomInt } from "../lib/utils"
import showEarnings from "../trials/showEarnings"

/**
 * Sets up a Stroop trial.
 * @param experimentConfig The experiment config object.
 * @param word The color word to display for this trial.
 * @returns {any} A jsPsych trial object containing a Stroop trial timeline.
 */
const taskTrial = (experimentConfig, word) => {
  // Set a random font color for the trial, using the colors provided in experimentConfig.
  const colors = experimentConfig.conditions
  const color = colors[getRandomInt(colors.length)]

  let timeline = [
    // Just show the fixation dot.
    fixation(envConfig, {
      duration: 650,
    }),
    // Display a word and wait for user input.
    choice(word, color, experimentConfig.response_time),
    // End the trial by displaying the participant's earnings.
    showEarnings(1500)
  ];

  return {
    type: "html_keyboard_response",
    timeline: timeline,
  };
};

export default taskTrial;
