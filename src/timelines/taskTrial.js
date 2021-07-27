// import trials
import { showMessage, fixation } from "@brown-ccv/behavioral-task-trials";
import { envConfig } from "../config/main";
import { eventCodes } from "../config/main";
import { earningsDisplay } from "../lib/markup/earnings";
import choice from "../trials/choice"
import { getRandomInt } from "../lib/utils"
import showEarnings from "../trials/showEarnings"

const taskTrial = (blockSettings, blockDetails, word) => {
  // Set a random font color for the trial.
  const colors = ["red", "blue", "yellow"]
  const color = colors[getRandomInt(3)]

  let timeline = [
    // Just show the fixation dot.
    fixation(envConfig, {
      duration: 650,
    }),
    // Display a word and wait for user input.
    choice(word, color),
    // End the trial by displaying the participant's earnings.
    showEarnings(1500)
  ];

  return {
    type: "html_keyboard_response",
    timeline: timeline,
  };
};

export default taskTrial;
