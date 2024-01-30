import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { LANGUAGE } from "../config/main";
import { h1 } from "../lib/markup/tags";

/** Trial that displays a completion message for 5 seconds */
// TODO #367: Use trial inside endBlock
const conclusionTrial = {
  type: htmlKeyboardResponse,
  stimulus: h1(LANGUAGE.trials.conclusion),
  choices: "NO_KEYS",
  trial_duration: 5000,
};

export { conclusionTrial };
