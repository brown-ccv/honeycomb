import jsPsychHtmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import taskTrial from "./exampleTrial";
import { generateStartingOpts } from "../lib/taskUtils";

const taskBlock = (blockSettings) => {
  // initialize block
  const startingOpts = generateStartingOpts(blockSettings);

  const blockDetails = {
    block_earnings: 0.0,
    optimal_earnings: 0.0,
    continue_block: true,
  };

  // timeline = loop through trials
  const timeline = startingOpts.map((condition) =>
    taskTrial(blockSettings, blockDetails, condition)
  );

  const blockStart = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    trial_duration: 1,
    on_finish: (data) => {
      data.block_settings = blockSettings;
    },
  };

  timeline.unshift(blockStart);

  return {
    type: jsPsychHtmlKeyboardResponse,
    timeline,
  };
};

export default taskBlock;
