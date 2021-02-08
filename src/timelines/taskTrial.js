// import trials
import { showMessage, fixation } from "@brown-ccv/behavioral-task-trials";
import { config } from "../config/main";
import { eventCodes } from "../config/main";
import { earningsDisplay } from "../lib/markup/earnings";

const taskTrial = (blockSettings, blockDetails, condition) => {
  // timeline
  let timeline = [
    // show condition
    showMessage(
      "html_keyboard_response",
      1000,
      config,
      condition,
      true,
      false,
      eventCodes.evidence,
      eventCodes.evidence
    ),
    fixation(
      "html_keyboard_response",
      650,
      config,
      false,
      eventCodes.fixation,
      eventCodes.fixation
    ),
    // end the trial
    showMessage(
      "html_keyboard_response",
      1000,
      config,
      earningsDisplay(Math.random()),
      true,
      false,
      eventCodes.show_earnings,
      eventCodes.show_earnings
    ),
  ];

  return {
    type: "html_keyboard_response",
    timeline: timeline,
  };
};

export default taskTrial;
