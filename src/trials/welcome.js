import { showMessage } from "@brown-ccv/behavioral-task-trials";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { config, language } from "../config/main";
import { photodiodeGhostBox } from "../lib/markup/photodiode";
import { baseStimulus } from "../lib/markup/stimuli";
import { h1 } from "../lib/markup/tags";

/**
 * Task that displays the name of the experiment
 */
// TODO: Turn into jsPsych instruction trial (config is only used for task name)
function showName() {
  return showMessage(config, {
    responseType: htmlButtonResponse,
    message: language.name,
    responseEndsTrial: true,
    buttons: [language.prompts.continue.button],
  });
}

/**
 * Task that displays a welcome message with the photodiode ghost box
 */
// TODO: Turn into jsPsych instruction trial
function showWelcome() {
  const welcomeMarkup = h1(language.trials.welcome);
  return {
    type: htmlKeyboardResponse,
    stimulus: baseStimulus(welcomeMarkup, true) + photodiodeGhostBox(),
    prompt: language.prompts.continue.prompt,
    response_ends_trial: true,
  };
}

export { showName, showWelcome };
