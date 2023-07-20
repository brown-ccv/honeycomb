import HtmlButtonResponse from "@jspsych/plugin-html-button-response";

import { language } from "../../../language";
import { showMessage } from "@brown-ccv/behavioral-task-trials";

import { OLD_CONFIG } from "../constants";

/**
 * Final button page with "Confirm Completion" text
 */
// TODO 235: Use JsPsych survey prompts https://www.jspsych.org/7.3/plugins/survey/
// TODO 235: Need a better name
export function createDebriefSurvey() {
  const confirmButtonText = language.quiz.answer.debriefing.confirm_completion;

  return showMessage(OLD_CONFIG, {
    responseType: HtmlButtonResponse,
    responseEndsTrial: true,
    buttons: [confirmButtonText],
  });
}

export const DebriefSurvey = createDebriefSurvey();
