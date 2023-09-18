import { showMessage } from "@brown-ccv/behavioral-task-trials";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import instructionsResponse from "@jspsych/plugin-instructions";
import preloadResponse from "@jspsych/plugin-preload";

import { config, language, taskSettings } from "../config/main";

const honeycombLanguage = language.trials.honeycomb;

/**
 * Trial that displays a welcome message and waits for the participant to press a key
 */
const welcomeTrial = {
  type: htmlKeyboardResponse,
  stimulus: `<p>${honeycombLanguage.welcome}</p>`,
};

/**
 * Trial that displays instructions for the participant.
 * Note that the participant has the ability to navigate between the pages of the instructions.
 *
 * Instructions have been altered from the original tutorial to match the instructions plugin:
 * https://www.jspsych.org/7.3/plugins/instructions/#including-images
 */
const instructionsTrial = {
  type: instructionsResponse,
  pages: [
    `<p>${honeycombLanguage.instructions.read}</p>`,
    `<p>${honeycombLanguage.instructions.circle}</p>`,
    // Add a page for very possible stimuli - displays the image and the correct response
    ...taskSettings.honeycomb.timeline_variables.map(({ stimulus, correct_response }) => {
      const color = stimulus.substring(stimulus.lastIndexOf("/") + 1, stimulus.indexOf(".")); // Pull the color out of the file name
      return `<p>${honeycombLanguage.instructions.example.start} <strong>${color}</strong>
      ${honeycombLanguage.instructions.example.middle} <strong>${correct_response}</strong> 
      ${honeycombLanguage.instructions.example.end}</p>
      <br />
      <img src=${stimulus} />`;
    }),
    `<p>${honeycombLanguage.instructions.next}</p>`,
  ],
  show_clickable_nav: true,
  post_trial_gap: 500,
};

// TODO 281: Function for preloading all files in public/images?
/** Trial that loads all of the stimulus images */
const preloadTrial = {
  type: preloadResponse,
  message: `<p>${language.prompts.settingUp}<p>`,
  images: taskSettings.honeycomb.timeline_variables.map(({ stimulus }) => stimulus),
};

/** Trial that calculates and displays some results of the session  */
const createDebriefTrial = (jsPsych) => ({
  type: htmlKeyboardResponse,
  stimulus: function () {
    // Note that we need the jsPsych instance to aggregate the data
    const responseTrials = jsPsych.data.get().filter({ task: "response" });
    const correct_trials = responseTrials.filter({ correct: true });
    const accuracy = Math.round((correct_trials.count() / responseTrials.count()) * 100);
    const reactionTime = Math.round(correct_trials.select("rt").mean());

    const trialLanguage = honeycombLanguage.debrief;
    return `<p>${trialLanguage.accuracy.start} ${accuracy}${trialLanguage.accuracy.end}</p>
    <p>${trialLanguage.reactionTime.start} ${reactionTime}${trialLanguage.reactionTime.end}</p>
    <p>${trialLanguage.complete}</p>`;
  },
});

/** Trial that displays a completion message for 5 seconds */
const finishTrial = showMessage(config, {
  duration: 5000,
  message: honeycombLanguage.finish,
});

export { createDebriefTrial, finishTrial, instructionsTrial, preloadTrial, welcomeTrial };
