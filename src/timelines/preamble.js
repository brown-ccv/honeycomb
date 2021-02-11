import { jsPsych } from "jspsych-react";
import { eventCodes, lang } from "../config/main";
import holdUpMarker from "../trials/holdUpMarker";
import { showMessage, userId } from "@brown-ccv/behavioral-task-trials";
import { config, AT_HOME } from "../config/main";
console.log("at_home", AT_HOME);
console.log("env at home", process.env.REACT_APP_AT_HOME);

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
        }),
        userId(jsPsych, config, {
          duration: 800,
          setIdMessage: lang.userid.set,
        }),
      ]
    : [
        showMessage(config, {
          responseType: "html_button_response",
          message: lang.task.name,
          responseEndsTrial: true,
          buttons: [lang.prompt.continue.button],
        }),
        userId(jsPsych, config, {
          setIdMessage: lang.userid.set,
          defaultId: process.env.REACT_APP_PATIENT_ID,
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
