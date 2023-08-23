import jsPsychHtmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import jsPsychInstructionsResponse from "@jspsych/plugin-instructions";

/**
 * This timeline builds the example reaction time task from the jsPsych tutorial.
 * Take a look at how the code here compares to the jsPsych documentation!
 *
 * See the jsPsych documentation for more: https://www.jspsych.org/7.3/tutorials/rt-task/
 */

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
const instructionsTrial = {
  type: jsPsychInstructionsResponse,
  pages: [
    // TODO: Pull text into language file
    "Please read the following instructions carefully.",
    "In this experiment, a circle will appear in the center of the screen.",
    `If the circle is <strong>blue</strong>, press the letter <strong>F</strong> on the keyboard as fast as you can.
    <br />
    <img src="images/blue_circle.png" />`,
    `If the circle is <strong>orange</strong>, press the letter <strong>J</strong> as fast as you can.
    <br />
    <img src="images/orange_circle.png" />`,
    "Click next to begin.",
  ],
  show_clickable_nav: true,
  post_trial_gap: 2000,
};

export { welcomeTrial, instructionsTrial };
