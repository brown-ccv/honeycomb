import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { LANGUAGE } from "../../config/main";
import { div, p, h1 } from "../../lib/markup/tags";

/** Task that displays a introduction message with the photodiode ghost box */
export const introductionTrial = {
  type: htmlKeyboardResponse,
  response_ends_trial: true,
  stimulus: function () {
    const introductionMarkup = h1(LANGUAGE.trials.introduction);
    return div(introductionMarkup);
  },
  prompt: p(LANGUAGE.prompts.continue.prompt),
};
