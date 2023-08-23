// import { enterFullscreen, exitFullscreen } from "../trials/fullscreen";
import { createHoneycombBlock } from "./honeycombBlock";
import { endTrial, instructionsTrial, welcomeTrial } from "./honeycombTrials";

/**
 * This timeline builds the example reaction time task from the jsPsych tutorial.
 * Take a look at how the code here compares to the jsPsych documentation!
 *
 * See the jsPsych documentation for more: https://www.jspsych.org/7.3/tutorials/rt-task/
 */

// TODO: Add practice/tutorial block?

function createHoneycombTimeline(jsPsych) {
  const block1 = createHoneycombBlock(jsPsych);

  console.log(jsPsych, block1);
  const timeline = [
    welcomeTrial,
    // enterFullscreen,
    instructionsTrial,
    block1,
    endTrial,
    // exitFullscreen,
  ];

  return timeline;
}

export { createHoneycombTimeline };
