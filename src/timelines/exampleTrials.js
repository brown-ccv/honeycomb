import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import imageKeyboardResponse from "@jspsych/plugin-image-keyboard-response";
import instructionsResponse from "@jspsych/plugin-instructions";

// TODO: Pull text into language file

/**
 * Trial that displays a welcome message and waits for the participant to press a key
 */
const welcomeTrial = {
  type: htmlKeyboardResponse,
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
  type: instructionsResponse,
  pages: [
    // TODO: Pull text into language file
    "Please read the following instructions carefully.",
    "In this experiment, a circle will appear in the center of the screen.",
    `If the circle is <strong>blue</strong>, press the letter <strong>F</strong> on the keyboard as fast as you can.
    <br />
    <img src="images/blue.png" />`,
    `If the circle is <strong>orange</strong>, press the letter <strong>J</strong> as fast as you can.
    <br />
    <img src="images/orange.png" />`,
    "Click next to begin.",
  ],
  show_clickable_nav: true,
  post_trial_gap: 1000,
};

const blueTrial = {
  type: imageKeyboardResponse,
  stimulus: "images/blue.png",
  choices: ["f", "j"],
};

const orangeTrial = {
  type: imageKeyboardResponse,
  stimulus: "images/orange.png",
  choices: ["f", "j"],
};

export { blueTrial, instructionsTrial, orangeTrial, welcomeTrial };

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
//     type: htmlKeyboardResponse,
//     timeline,
//   };
// };

// export default taskTrial;
