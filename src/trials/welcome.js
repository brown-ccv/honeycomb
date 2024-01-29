import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { config, eventCodes, LANGUAGE } from "../config/main";
import { pdSpotEncode, photodiodeGhostBox } from "../lib/markup/photodiode";
import { div, h1 } from "../lib/markup/tags";

/** Task that displays the name of the experiment */
const nameTrial = {
  type: htmlKeyboardResponse,
  stimulus: h1(LANGUAGE.name),
  choices: "NO_KEYS",
  trial_duration: 1000,
};

/** Task that displays a welcome message with the photodiode ghost box */
const welcomeTrial = {
  type: htmlKeyboardResponse,
  stimulus: () => {
    const welcomeMarkup = h1(LANGUAGE.welcome);
    return div(welcomeMarkup, { class: "bottom-prompt" }) + photodiodeGhostBox;
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

export { nameTrial, welcomeTrial };
