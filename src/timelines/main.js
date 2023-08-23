import { config } from "../config/main";

import { cameraEnd, cameraStart } from "../trials/camera";

import { createHoneycombTimeline } from "./honeycombTimeline";

// Add your jsPsych options here.
// Honeycomb will combine these custom options with other options needed by Honyecomb.
const jsPsychOptions = {
  on_trial_finish: function (data) {
    console.log("A trial just ended, here are the latest data:");
    console.log(data);
  },
  default_iti: 250,
};

// Add your jsPsych timeline here.
// Honeycomb will call this function for us after the subject logs in, and run the resulting timeline.
// The instance of jsPsych passed in will include jsPsychOptions above, plus other options needed by Honeycomb.
function buildTimeline(jsPsych) {
  const primaryTimeline = createHoneycombTimeline(jsPsych);

  if (config.USE_CAMERA) {
    // Add cameraStart after welcome trial
    primaryTimeline.splice(1, 0, cameraStart(jsPsych));
    // Add cameraEnd as the last trial
    primaryTimeline.push(cameraEnd(5000));
  }

  return primaryTimeline;
}

export { buildTimeline, jsPsychOptions };
