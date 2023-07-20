import HtmlButtonResponse from "@jspsych/plugin-html-button-response";

import { language } from "../../../language";
import { showMessage } from "@brown-ccv/behavioral-task-trials";

// TODO 226: This is a task, how do I pass which config file to use?
// Hard code for now
import config from "../../../config/home.json";
import { useOldConfig } from "../../../../utils";

/**
 * Final button page with "Confirm Completion" text
 */
// TODO 235: Use JsPsych survey prompts https://www.jspsych.org/7.3/plugins/survey/
// TODO 235: Need a better name
export function createDebriefSurvey() {
  const oldConfig = useOldConfig(config);
  const confirmButtonText = language.quiz.answer.debriefing.confirm_completion;

  return showMessage(oldConfig, {
    responseType: HtmlButtonResponse,
    responseEndsTrial: true,
    buttons: [confirmButtonText],
  });
}

export const DebriefSurvey = createDebriefSurvey();
