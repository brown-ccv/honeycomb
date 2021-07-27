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

  // Initialize trial parameters.
  let trialDetails = {
    earnings: 0
  }

  let timeline = [
    // Just show the fixation dot.
    fixation(envConfig, {
      duration: 650,
    }),
    // Display a word and wait for user input.
    choice(trialDetails, word, color, 3000),
    fixation(envConfig, {
      duration: 650,
    }),
    // End the trial by displaying the participant's earnings.
    showEarnings(trialDetails, 1000)
  ];

  return {
    type: "html_keyboard_response",
    timeline: timeline,
  };
};

export default taskTrial;
