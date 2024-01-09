import { showMessage } from "@brown-ccv/behavioral-task-trials";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { config, LANGUAGE } from "../config/main";
import { photodiodeGhostBox } from "../lib/markup/photodiode";
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
    const welcomeMarkup = h1(LANGUAGE.trials.welcome);
    return baseStimulus(welcomeMarkup, true) + photodiodeGhostBox;
  },
  prompt: LANGUAGE.prompts.continue.prompt,
  response_ends_trial: true,
};
// TODO #292: Turn into jsPsych NO_KEYS trial
// TODO #365: Move showMessage into this repo?

export { nameTrial, welcomeTrial };
