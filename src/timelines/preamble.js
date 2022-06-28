import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response'
import htmlButtonResponse from '@jspsych/plugin-html-button-response'
import { showMessage } from "@brown-ccv/behavioral-task-trials";
import holdUpMarker from "../trials/holdUpMarker";
import startCode from "../trials/startCode";
import { lang, config } from "../config/main";

let timeline = [showMessage(config, {
  responseType: htmlButtonResponse,
  message: lang.task.name,
  responseEndsTrial: true,
  buttons: [lang.prompt.continue.button],
})]
if (config.USE_PHOTODIODE) {
  timeline.push(holdUpMarker())
  timeline.push(startCode())
}

const preamble = {
  type: htmlKeyboardResponse,
  stimulus: "",
  timeline: timeline
};


export default preamble;
