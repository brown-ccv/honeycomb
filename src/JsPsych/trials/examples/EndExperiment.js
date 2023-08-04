import { showMessage } from "@brown-ccv/behavioral-task-trials";

// TODO 226: This is a task, how do I pass which config file to use?
// Hard code for now
import { language } from "../../language";
import { OLD_CONFIG } from "../../../constants";

export function createEndExperimentTrial() {
  return showMessage(OLD_CONFIG, {
    duration: 5000,
    message: language.task.end,
  });
}

export const EndExperiment = createEndExperimentTrial();
