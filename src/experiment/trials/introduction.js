import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { LANGUAGE } from "../../config/main";
import { div, h1 } from "../../lib/markup/tags";

/** Task that displays a welcome message with the photodiode ghost box */
export const introductionTrial = {
  type: htmlKeyboardResponse,
  response_ends_trial: true,
  stimulus: function () {
    const welcomeMarkup = h1(LANGUAGE.trials.welcome);
    return div(welcomeMarkup, { class: "bottom-prompt" });
  },
  prompt: LANGUAGE.prompts.continue.prompt,
};
