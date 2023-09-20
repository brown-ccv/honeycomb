import { showMessage } from "@brown-ccv/behavioral-task-trials";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import instructionsResponse from "@jspsych/plugin-instructions";
import preloadResponse from "@jspsych/plugin-preload";

import { config, language, taskSettings } from "../config/main";
import { div, image, p, b } from "../lib/markup/tags";

const honeycombLanguage = language.trials.honeycomb;

/**
 * Trial that displays a welcome message and waits for the participant to press a key
 */
const welcomeTrial = {
  type: htmlKeyboardResponse,
  stimulus: p(honeycombLanguage.welcome),
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
    p(honeycombLanguage.instructions.read),
    p(honeycombLanguage.instructions.circle),
    // Add a page for very possible stimuli - displays the image and the correct response
    ...taskSettings.honeycomb.timeline_variables.map(({ stimulus, correct_response }) => {
      // Pull the color out of the file name
      const color = stimulus.substring(stimulus.lastIndexOf("/") + 1, stimulus.indexOf("."));

      // Build the instructions and image elements
      const instructionsMarkup = p(
        honeycombLanguage.instructions.example.start +
          b(color) +
          honeycombLanguage.instructions.example.middle +
          b(correct_response) +
          honeycombLanguage.instructions.example.end
      );
      const imageMarkup = image({ src: stimulus });

      return div(instructionsMarkup + imageMarkup);
    }),
    p(honeycombLanguage.instructions.next),
  ],
  show_clickable_nav: true,
  post_trial_gap: 500,
};

// TODO 281: Function for preloading all files in public/images?
/** Trial that loads all of the stimulus images */
const preloadTrial = {
  type: preloadResponse,
  message: p(language.prompts.settingUp),
  images: taskSettings.honeycomb.timeline_variables.map(({ stimulus }) => stimulus),
};

/** Trial that calculates and displays some results of the session  */
const createDebriefTrial = (jsPsych) => ({
  type: htmlKeyboardResponse,
  stimulus: () => {
    // Note that we need the jsPsych instance to aggregate the data
    const responseTrials = jsPsych.data.get().filter({ task: "response" });
    const correct_trials = responseTrials.filter({ correct: true });
    const accuracy = Math.round((correct_trials.count() / responseTrials.count()) * 100);
    const reactionTime = Math.round(correct_trials.select("rt").mean());

    const debriefLanguage = honeycombLanguage.debrief;

    const accuracyMarkup = p(
      debriefLanguage.accuracy.start + accuracy + debriefLanguage.accuracy.end
    );
    const reactionTimeMarkup = p(
      debriefLanguage.reactionTime.start + reactionTime + debriefLanguage.reactionTime.end
    );
    const completeMarkup = p(debriefLanguage.complete);

    // Display the accuracy, reaction time, and complete message as 3 paragraphs in a row
    return accuracyMarkup + reactionTimeMarkup + completeMarkup;
  },
});

/** Trial that displays a completion message for 5 seconds */
const finishTrial = showMessage(config, {
  duration: 5000,
  message: honeycombLanguage.finish,
});

export { createDebriefTrial, finishTrial, instructionsTrial, preloadTrial, welcomeTrial };
