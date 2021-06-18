import holdUpMarker from "../trials/holdUpMarker";
import { eventCodes, lang, config } from "../config/main";
import { showMessage } from "@brown-ccv/behavioral-task-trials";

let timeline = [showMessage(config, {
  responseType: "html_button_response",
  message: lang.task.name,
  responseEndsTrial: true,
  buttons: [lang.prompt.continue.button],
})]
if (config.USE_PHOTODIODE) {
  timeline.push(holdUpMarker())
  timeline.push(showMessage(config, {
    duration: 2000,
    message: lang.prompt.setting_up,
    taskCode: eventCodes.open_task,
    numBlinks: eventCodes.open_task,
  }))
}

const preamble = {
  type: "html_keyboard_response",
  stimulus: "",
  timeline: timeline
};



export default preamble;
