import jsPsychInstructions from "@jspsych/plugin-instructions";

import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import { showMessage } from "@brown-ccv/behavioral-task-trials";

// TODO 204: Use @signature for imports?
import { language } from "../../language"; // @language
import { HoldUpMarker, StartCode } from "./photodiode"; // @trials

// TODO 226: This is a task, how do I pass which config file to use?
// Hard code for now
import config from "../../config/home.json";
import { useOldConfig } from "../../../utils";

// TODO 213: Rename as introduction?
// TODO 213: Note that instructions can have multiple pages in the same trial https://www.jspsych.org/7.3/plugins/instructions/#examples
export function createPreambleTrial() {
  const oldConfig = useOldConfig(config);

  // Trial that shows the task name with a continue button
  const introductionMessage = showMessage(oldConfig, {
    responseType: htmlButtonResponse,
    message: language.task.name,
    responseEndsTrial: true,
    buttons: [language.prompt.continue.button],
  });

  const timeline = [introductionMessage];

  // Add photodiode trials if using it
  // TODO 226: Move to timeline? Expect to add there
  // if (oldConfig.USE_PHOTODIODE) {
  if (config.equipment.photodiode) {
    timeline.push(HoldUpMarker);
    timeline.push(StartCode);
  }

  return {
    type: jsPsychInstructions,
    stimulus: "",
    timeline,
  };
}

export const Preamble = createPreambleTrial();
