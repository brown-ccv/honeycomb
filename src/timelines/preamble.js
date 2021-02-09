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
        showMessage(
          "html_button_response",
          ...Array(1),
          config,
          `<h1>${lang.task.name}</h1>`,
          false,
          true,
          ...Array(2),
          [lang.prompt.continue.button]
        ),
        userId(
          jsPsych,
          "html_keyboard_response",
          800,
          config,
          lang.userid.set,
          ...Array(1),
          process.env.REACT_APP_PATIENT_ID
        ),
      ]
    : [
        showMessage(
          "html_button_response",
          ...Array(1),
          config,
          `<h1>${lang.task.name}</h1>`,
          false,
          true,
          ...Array(2),
          [lang.prompt.continue.button]
        ),
        userId(
          jsPsych,
          "html_keyboard_response",
          800,
          config,
          lang.userid.set,
          ...Array(1),
          process.env.REACT_APP_PATIENT_ID
        ),
        holdUpMarker(),
        showMessage(
          "html_keyboard_response",
          2000,
          config,
          `<h1>${lang.prompt.setting_up}</h1>`,
          false,
          ...Array(1),
          eventCodes.open_task,
          eventCodes.open_task
        ),
      ],
};

export default preamble;
