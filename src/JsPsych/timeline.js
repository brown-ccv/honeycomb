import { language } from './language';
// TODO: @ import for trials
import { Preamble, createSliderTrial } from './trials/examples';
import { AgeCheck } from './trials/examples/survey';

/**
 * Create your custom JsPsych options here. These settings will applied experiment wide.
 * These options are merged with Honeycomb's own defaults.
 * https://www.jspsych.org/7.3/overview/experiment-options/
 */
export const JSPSYCH_OPTIONS = {
  // Log each trial on the console
  on_trial_finish: function (data) {
    console.log('A trial just ended, here are the latest data:');
    console.log(data);
  },
  //   Sets the default inter-trial interval
  default_iti: 250,
};

/**
 * Build your JsPsych timeline here. The array must be passed as a prop to <JsPsychOptions />
 * @returns array of trials
 */
// TODO: Eslint warning is causing build to fail
// eslint-disable-next-line
export function buildTimeline(jsPsych) {
  // Get slider text from the language file and create the trials
  const sliderMessages = language.quiz.direction.slider;
  const sliderLeft = createSliderTrial(sliderMessages.left);
  const sliderRight = createSliderTrial(sliderMessages.right);

  // Build the timeline
  const timeline = [
    Preamble,
    AgeCheck,
    sliderLeft,
    sliderRight,
    // countdown({ message: lang.countdown.message1 }),
    // taskBlock(practiceBlock),
    // countdown({ message: lang.countdown.message2 }),
    // taskBlock(exptBlock1),
    // demographics,
    // iusSurvey,
    // debrief,
    // showMessage(config, {
    //   duration: 5000,
    //   message: lang.task.end,
    // }),
  ];
  return timeline;
}

// TODO: I think the user needs to confirm if they're going to enable audio?

export const timeline = buildTimeline();
