import { showMessage } from "@brown-ccv/behavioral-task-trials";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { config, lang } from "../config/main";
import { photodiodeGhostBox } from "../lib/markup/photodiode";
import { baseStimulus } from "../lib/markup/stimuli";

// TODO: Turn into jsPsych instruction trial (config is only used for task name)
export const showName = showMessage(config, {
  responseType: htmlButtonResponse,
  message: lang.name,
  responseEndsTrial: true,
  buttons: [lang.prompts.continue.button],
});

// TODO: Turn into jsPsych instruction trial
export const showWelcome = {
  type: htmlKeyboardResponse,
  stimulus: baseStimulus(`<h1>${lang.prompts.welcome}</h1>`, true) + photodiodeGhostBox(),
  prompt: lang.prompts.continue.press,
  response_ends_trial: true,
};
