import { showMessage } from "@brown-ccv/behavioral-task-trials";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { config, eventCodes, LANGUAGE } from "../config/main";
import { pdSpotEncode, photodiodeGhostBox } from "../lib/markup/photodiode";
import { baseStimulus } from "../lib/markup/stimuli";
import { h1 } from "../lib/markup/tags";

/** Task that displays the name of the experiment */
const nameTrial = showMessage(config, {
  responseType: htmlButtonResponse,
  message: LANGUAGE.name,
  responseEndsTrial: true,
  buttons: [LANGUAGE.prompts.continue.button],
});
// TODO #292: Turn into jsPsych NO_KEYS trial
// TODO #365: Move showMessage into this repo?

/** Task that displays a welcome message with the photodiode ghost box */
const welcomeTrial = {
  type: htmlKeyboardResponse,
  stimulus: () => {
    const welcomeMarkup = h1(LANGUAGE.welcome);
    return baseStimulus(welcomeMarkup, true) + photodiodeGhostBox;
  },
  prompt: () => {
    let promptMarkup = LANGUAGE.prompts.continue.prompt;

    // Conditionally displays the photodiodeGhostBox
    if (config.USE_PHOTODIODE) promptMarkup += photodiodeGhostBox;

    return promptMarkup;
  },
  on_load: () => {
    // Conditionally flashes the photodiode when the trial first loads
    if (config.USE_PHOTODIODE) pdSpotEncode(eventCodes.test_connect);
  },
  response_ends_trial: true,
};
// TODO #292: Turn into jsPsych NO_KEYS trial
// TODO #365: Move showMessage into this repo?

export { nameTrial, welcomeTrial };
