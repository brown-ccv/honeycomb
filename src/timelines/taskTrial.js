// import trials
import { fixation } from "@brown-ccv/behavioral-task-trials";
import { envConfig } from "../config/main";
import choice from "../trials/choice"
import { getRandomInt } from "../lib/utils"
import showEarnings from "../trials/showEarnings"

const taskTrial = (blockSettings, word) => {
  // Set a random font color for the trial.
  const colors = blockSettings.conditions
  const color = colors[getRandomInt(colors.length)]

  let timeline = [
    // Just show the fixation dot.
    fixation(envConfig, {
      duration: 650,
    }),
    // Display a word and wait for user input.
    choice(word, color, blockSettings.response_time),
    // End the trial by displaying the participant's earnings.
    showEarnings(1500)
  ];

  return {
    type: "html_keyboard_response",
    timeline: timeline,
  };
};

export default taskTrial;
