import { showMessage } from "@brown-ccv/behavioral-task-trials";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { config, language } from "../config/main";
import { photodiodeGhostBox } from "../lib/markup/photodiode";
import { baseStimulus } from "../lib/markup/stimuli";
import { h1 } from "../lib/markup/tags";

/** Task that displays the name of the experiment */
const showName = showMessage(config, {
  responseType: htmlButtonResponse,
  message: language.name,
  responseEndsTrial: true,
  buttons: [language.prompts.continue.button],
});
// TODO #292: Turn into jsPsych NO_KEYS trial
// TODO: Move showMessage into this repo?

/** Task that displays a welcome message with the photodiode ghost box */
const showWelcome = {
  type: htmlKeyboardResponse,
  stimulus: () => {
    const welcomeMarkup = h1(language.trials.welcome);
    return baseStimulus(welcomeMarkup, true) + photodiodeGhostBox;
  },
  prompt: language.prompts.continue.prompt,
  response_ends_trial: true,
};
// TODO #292: Turn into jsPsych NO_KEYS trial

export { showName, showWelcome };
