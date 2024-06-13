import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { LANGUAGE } from "../../config/main";
import { div, p } from "../../lib/markup/tags";

/** Task that displays a introduction message with the photodiode ghost box */
export const introductionTrial = {
  type: htmlKeyboardResponse,
  response_ends_trial: true,
  stimulus: function () {
    const introductionMarkup = p(LANGUAGE.trials.introduction);
    return div(introductionMarkup);
  },
  prompt: LANGUAGE.prompts.continue.prompt,
};
