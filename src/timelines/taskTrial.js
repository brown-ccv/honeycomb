// import trials
import { showMessage, fixation } from "@brown-ccv/behavioral-task-trials";
import { envConfig } from "../config/main";
import { eventCodes } from "../config/main";
import { earningsDisplay } from "../lib/markup/earnings";

const taskTrial = (blockSettings, blockDetails, condition) => {
  // timeline
  let timeline = [
    // fixation
    fixation(envConfig, {
      duration: 650,
    }),
    // show condition
    showMessage(envConfig, {
      message: condition,
      onstart: true,
      taskCode: eventCodes.evidence,
    }),
    fixation(envConfig, {
      duration: 650,
    }),
    // end the trial
    showMessage(envConfig, {
      stimulus: earningsDisplay(Math.random()),
      taskCode: eventCodes.show_earnings,
    }),
  ];

  return {
    type: "html_keyboard_response",
    timeline: timeline,
  };
};

export default taskTrial;
