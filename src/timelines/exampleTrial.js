import jsPsychImageKeyboardResponse from "@jspsych/plugin-image-keyboard-response";
import jsPsychHtmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import jsPsychInstructionsResponse from "@jspsych/plugin-instructions";

// TODO: Pull text into language file

/**
 * Trial that displays a welcome message and waits for the participant to press a key
 */
const welcomeTrial = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "Welcome to the experiment. Press any key to begin.",
};

/**
 * Trial that displays instructions for the participant.
 * Note that the participant has the ability to navigate between the pages of the instructions.
 *
 * Instructions have been altered from the original tutorial to match the instructions plugin:
 * https://www.jspsych.org/7.3/plugins/instructions/#including-images
 */
// TODO: Should instructions be in its own file?
const instructionsTrial = {
  type: jsPsychInstructionsResponse,
  pages: [
    // TODO: Pull text into language file
    "Please read the following instructions carefully.",
    "In this experiment, a circle will appear in the center of the screen.",
    `If the circle is <strong>blue</strong>, press the letter <strong>F</strong> on the keyboard as fast as you can.
    <br />
    <img src="src/assets/images/blue_circle.png" />`,
    `If the circle is <strong>orange</strong>, press the letter <strong>J</strong> as fast as you can.
    <br />
    <img src="src/assets/images/orange_circle.png" />`,
    "Click next to begin.",
  ],
  show_clickable_nav: true,
  post_trial_gap: 2000,
};

const blueTrial = {
  type: jsPsychImageKeyboardResponse,
  stimulus: "images/blue.png",
  choices: ["f", "j"],
};

const orangeTrial = {
  type: jsPsychImageKeyboardResponse,
  stimulus: "images/orange.png",
  choices: ["f", "j"],
};

export { blueTrial, orangeTrial, welcomeTrial, instructionsTrial };

// import { showMessage, fixation } from "@brown-ccv/behavioral-task-trials";
// import { config, eventCodes } from "../config/main";

// const taskTrial = (blockSettings, blockDetails, condition) => {
//   // timeline
//   const timeline = [
//     // fixation
//     fixation(config, { duration: 650 }),
//     // show condition
//     showMessage(config, {
//       message: condition,
//       onstart: true,
//       taskCode: eventCodes.evidence,
//     }),
//     fixation(config, {
//       duration: 650,
//     }),
//     // end the trial
//     showMessage(config, {
//       stimulus: earningsDisplay(Math.random()),
//       taskCode: eventCodes.show_earnings,
//     }),
//   ];

//   return {
//     type: jsPsychHtmlKeyboardResponse,
//     timeline,
//   };
// };

// export default taskTrial;
