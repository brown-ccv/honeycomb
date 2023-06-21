/**
 * Create your custom JsPsych options here. These settings will applied experiment wide.
 * These options are merged with Honeycomb's own defaults
 */
// TODO: Can this be json? I don't think so?
export const JSPSYCH_OPTIONS = {
  // Log each trial on the console
  on_trial_finish: function (data) {
    console.log('A trial just ended, here are the latest data:');
    console.log(data);
  },
  //   Sets the default inter-trial interval
  default_iti: 250,
};

export function buildTimeline() {
  const timeline = [];
  return timeline;
}
