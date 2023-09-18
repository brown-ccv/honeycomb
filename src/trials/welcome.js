import { showMessage } from "@brown-ccv/behavioral-task-trials";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { config, language } from "../config/main";
import { photodiodeGhostBox } from "../lib/markup/photodiode";
import { baseStimulus } from "../lib/markup/stimuli";

// TODO 292: Turn into jsPsych instruction trial (config is only used for task name)
export const showName = showMessage(config, {
  responseType: htmlButtonResponse,
  message: language.name,
  responseEndsTrial: true,
  buttons: [language.prompts.continue.button],
});

// TODO 292: Turn into jsPsych instruction trial
export const showWelcome = {
  type: htmlKeyboardResponse,
  stimulus: baseStimulus(`<h1>${language.trials.welcome}</h1>`, true) + photodiodeGhostBox(),
  prompt: language.prompts.continue.prompt,
  response_ends_trial: true,
};
