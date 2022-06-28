import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response'
import { showMessage, fixation } from "@brown-ccv/behavioral-task-trials";
import { config } from "../config/main";
import { eventCodes } from "../config/main";
import { earningsDisplay } from "../lib/markup/earnings";

const taskTrial = (blockSettings, blockDetails, condition) => {
  // timeline
  let timeline = [
    // fixation
    fixation(config, {
      duration: 650,
    }),
    // show condition
    showMessage(config, {
      message: condition,
      onstart: true,
      taskCode: eventCodes.evidence,
    }),
    fixation(config, {
      duration: 650,
    }),
    // end the trial
    showMessage(config, {
      stimulus: earningsDisplay(Math.random()),
      taskCode: eventCodes.show_earnings,
    }),
  ];

  return {
    type: htmlKeyboardResponse,
    timeline: timeline,
  };
};

export default taskTrial;
