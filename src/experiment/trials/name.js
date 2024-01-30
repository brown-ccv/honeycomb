import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { LANGUAGE } from "../../config/main";
import { h1 } from "../../lib/markup/tags";

/** Task that displays the name of the experiment */
export const nameTrial = {
  type: htmlKeyboardResponse,
  stimulus: h1(LANGUAGE.name),
  choices: "NO_KEYS",
  trial_duration: 1000,
};
