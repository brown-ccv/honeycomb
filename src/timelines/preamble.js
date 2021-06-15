import holdUpMarker from "../trials/holdUpMarker";
import { eventCodes, lang, config } from "../config/main";
import { showMessage } from "@brown-ccv/behavioral-task-trials";

const preamble = {
  type: "html_keyboard_response",
  stimulus: "",
  timeline: !config.USE_PHOTODIODE
    ? [
        showMessage(config, {
          responseType: "html_button_response",
          message: lang.task.name,
          responseEndsTrial: true,
          buttons: [lang.prompt.continue.button],
        })
      ]
    : [
        showMessage(config, {
          responseType: "html_button_response",
          message: lang.task.name,
          responseEndsTrial: true,
          buttons: [lang.prompt.continue.button],
        }),
        holdUpMarker(),
        showMessage(config, {
          duration: 2000,
          message: lang.prompt.setting_up,
          taskCode: eventCodes.open_task,
          numBlinks: eventCodes.open_task,
        }),
      ],
};

export default preamble;
