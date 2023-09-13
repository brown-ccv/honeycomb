import { showMessage } from "@brown-ccv/behavioral-task-trials";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { config, language } from "../config/main";
import { photodiodeGhostBox } from "../lib/markup/photodiode";
import { baseStimulus } from "../lib/markup/stimuli";
import { h1 } from "../lib/markup/tags";

// TODO: Turn into jsPsych instruction trial (config is only used for task name)
export const showName = showMessage(config, {
  responseType: htmlButtonResponse,
  message: language.name,
  responseEndsTrial: true,
  buttons: [language.prompts.continue.button],
});

// TODO: Turn into jsPsych instruction trial
export const showWelcome = () => {
  const welcomeMessage = h1(language.trials.welcome);
  return {
    type: htmlKeyboardResponse,
    stimulus: baseStimulus(welcomeMessage, true) + photodiodeGhostBox(),
    prompt: language.prompts.continue.prompt,
    response_ends_trial: true,
  };
};
