import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import instructionsResponse from "@jspsych/plugin-instructions";
import preloadResponse from "@jspsych/plugin-preload";

import { LANGUAGE, SETTINGS } from "../../config/main";
import { eventCodes } from "../../config/trigger";
import { b, div, image, p } from "../../lib/markup/tags";

const honeycombLanguage = LANGUAGE.trials.honeycomb;

/**
 * Trial that displays instructions for the participant.
 * Note that the participant has the ability to navigate between the pages of the instructions.
 *
 * Instructions have been altered from the original tutorial to match the instructions plugin:
 * https://www.jspsych.org/7.3/plugins/instructions/#including-images
 */
export const instructionsTrial = {
  type: instructionsResponse,
  pages: [
    p(honeycombLanguage.instructions.read),
    p(honeycombLanguage.instructions.circle),
    // Add a page for very possible stimuli - displays the image and the correct response
    ...SETTINGS.honeycomb.timeline_variables.map(({ stimulus, correct_response }) => {
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

/** Trial that loads all of the stimulus images */
// TODO @brown-ccv #281: Trial for preloading all files in public/images?
export const preloadTrial = {
  type: preloadResponse,
  message: p(LANGUAGE.prompts.settingUp),
  images: SETTINGS.honeycomb.timeline_variables.map(({ stimulus }) => stimulus),
};

/** Trial that calculates and displays some results of the session  */
export function buildDebriefTrial(jsPsych) {
  return {
    type: htmlKeyboardResponse,
    stimulus: function () {
      /**
       * Note that we need the jsPsych instance to aggregate the data.
       * By accessing jsPsych inside the "stimulus" callback we have access to all of the data when this trial is run
       * Calling jsPsych outside of the trial object would be executed to soon (when the experiment first starts) and would therefore have no data
       */
      const responseTrials = jsPsych.data.get().filter({ code: eventCodes.honeycomb });
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
  };
}
