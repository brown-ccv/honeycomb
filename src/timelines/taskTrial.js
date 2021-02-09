// import trials
import { showMessage, fixation } from "@brown-ccv/behavioral-task-trials";
import { config } from "../config/main";
import { eventCodes } from "../config/main";
import { earningsDisplay } from "../lib/markup/earnings";

const taskTrial = (blockSettings, blockDetails, condition) => {
  // timeline
  let timeline = [
    // fixation
    fixation(config, {
      responseType: "html_keyboard_response",
      duration: 650,
      taskCode: eventCodes.fixation,
    }),
    // show condition
    showMessage(config, {
      responseType: "html_keyboard_response",
      duration: 1000,
      message: condition,
      onstart: true,
      taskCode: eventCodes.evidence,
    }),
    fixation(config, {
      responseType: "html_keyboard_response",
      duration: 650,
      taskCode: eventCodes.fixation,
    }),
    // end the trial
    showMessage(config, {
      responseType: "html_keyboard_response",
      duration: 1000,
      message: earningsDisplay(Math.random()),
      taskCode: eventCodes.show_earnings,
    }),
  ];

  return {
    type: "html_keyboard_response",
    timeline: timeline,
  };
};

export default taskTrial;
