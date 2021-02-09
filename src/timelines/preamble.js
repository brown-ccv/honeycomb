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
          message: `<h1>${lang.task.name}</h1>`,
          responseEndsTrial: true,
          buttons: [lang.prompt.continue.button],
        }),
        userId(jsPsych, config, {
          responseType: "html_keyboard_response",
          duration: 800,
          setIdMessage: lang.userid.set,
          defaultPatientId: process.env.REACT_APP_PATIENT_ID,
        }),
      ]
    : [
        showMessage(config, {
          responseType: "html_button_response",
          message: `<h1>${lang.task.name}</h1>`,
          responseEndsTrial: true,
          buttons: [lang.prompt.continue.button],
        }),
        userId(jsPsych, config, {
          responseType: "html_keyboard_response",
          duration: 800,
          setIdMessage: lang.userid.set,
          defaultPatientId: process.env.REACT_APP_PATIENT_ID,
        }),
        holdUpMarker(),
        showMessage(config, {
          responseType: "html_keyboard_response",
          duration: 2000,
          message: `<h1>${lang.prompt.setting_up}</h1>`,
          taskCode: eventCodes.open_task,
          numBlinks: eventCodes.open_task,
        }),
      ],
};

export default preamble;
