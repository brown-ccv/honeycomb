import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { enterFullscreen, exitFullscreen } from "../trials/fullscreen";
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
  // TODO: Move block settings into config.json
  const honeycomb = createHoneycombBlock(jsPsych); // The first block repeats 5 times

  // Note that we need the jsPsych instance to aggregate the data
  const debriefTrial = {
    type: htmlKeyboardResponse,
    stimulus: function () {
      const responseTrials = jsPsych.data.get().filter({ task: "response" });
      const correct_trials = responseTrials.filter({ correct: true });
      const accuracy = Math.round((correct_trials.count() / responseTrials.count()) * 100);
      const averageReactionTime = Math.round(correct_trials.select("rt").mean());

      return `<p>You responded correctly on ${accuracy}% of the trials.</p>
          <p>Your average response time was ${averageReactionTime}ms.</p>
          <p>Press any key to complete the experiment. Thank you!</p>`;
    },
  };

  const timeline = [
    welcomeTrial,
    enterFullscreen,
    instructionsTrial,
    honeycomb,
    debriefTrial,
    endTrial,
    exitFullscreen,
  ];

  return timeline;
}

export { createHoneycombTimeline };
