// TODO 204: @ import for language
// import { language } from "./language";

// TODO 204: @ import for trials
import { Preamble, EndExperiment } from "./trials/examples";
// import { Preamble, createCountdownTrial, EndExperiment } from "./trials/examples";
// import { createHoneycombBlock } from "./trials/honeycombBlock";

/**
 * Create your custom JsPsych options here. These settings will applied experiment wide.
 * These options are merged with Honeycomb's own defaults.
 * https://www.jspsych.org/7.3/overview/experiment-options/
 */
export const JSPSYCH_OPTIONS = {
  // Log each trial on the console
  on_trial_finish: function (data) {
    console.log("A trial just ended, here are the latest data:");
    console.log(data);
  },
  //   Sets the default inter-trial interval
  default_iti: 250,
};

/**
 * Build your JsPsych timeline here. The array must be passed as a prop to <JsPsychOptions />
 * @returns array of trials
 */
// TODO 207: Eslint warning is causing build to fail
export function buildTimeline() {
  // Get countdown txt from the language fil and create the trials+
  // const countdownLanguage = language.countdown;
  // const firstBlockCountdown = createCountdownTrial({ message: countdownLanguage.first });
  // const secondBlockCountdown = createCountdownTrial({ message: countdownLanguage.second });

  // // Create a tutorial block of Honeycomb's custom task
  // const honeycombTutorialBlock = createHoneycombBlock({
  //   isTutorial: true,
  //   photodiodeActive: false,
  // });

  // // Create a practice block of Honeycomb's custom task
  // const honeycombPracticeBlock = createHoneycombBlock({
  //   conditions: ["m", "n"],
  //   repeatsPerCondition: 1,
  //   isPractice: true,
  // });

  // // Create an experiment block
  // const honeycombBlock1 = createHoneycombBlock({
  //   repeatsPerCondition: 2,
  // });

  // Build the timeline
  const timeline = [
    Preamble,
    // honeycombTutorialBlock,
    // firstBlockCountdown,
    // honeycombPracticeBlock,
    // secondBlockCountdown,
    // honeycombBlock1,
    EndExperiment, // Task complete message
  ];
  return timeline;
}

export const timeline = buildTimeline();
