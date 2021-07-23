import holdUpMarker from "../trials/holdUpMarker";
import startCode from "../trials/startCode";
import { lang, envConfig } from "../config/main";
import { showMessage } from "@brown-ccv/behavioral-task-trials";

let timeline = [showMessage(envConfig, {
  responseType: "html_button_response",
  message: lang.task.name,
  responseEndsTrial: true,
  buttons: [lang.prompt.continue.button],
})]
if (envConfig.USE_PHOTODIODE) {
  timeline.push(holdUpMarker())
  timeline.push(startCode())
}

const preamble = {
  type: "html_keyboard_response",
  stimulus: "",
  timeline: timeline
};



export default preamble;
