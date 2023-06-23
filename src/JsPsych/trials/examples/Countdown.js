import { range } from 'lodash';
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

/**
 * Builds a countdown transition with the given message and number of seconds.
 * Counts down from "time" to 0, each step is displayed for "duration" seconds
 *
 * @param {number} duration - trial duration in milliseconds. (default: 1000)
 * @param {string} stimulus - Onscreen stimulus in HTML to be shown in the trial. If the stimulus is not provided, message should be provided as a string. (default: "")
 * @param {string} message - (optional) message for the countdown. (default: "")
 * @param {number} time - start number for the countdown. (default: 3)
 */
// TODO 212: Always use <h3>? Pass message and remove stimulus? Default to undefined instead of empty strings?
// TODO 212: Can we do this in 1 trial instead of a nested timeline?
// TODO 212: This isn't a keyboard response? Just instructions? Definitely don't need user input
export function createCountdownTrial({
  duration = 1000, // Default to 1 second per trial
  stimulus = '', // Default empty stimulus
  message = '', // Default empty message
  time = 3, // Default 3...2...1... countdown
} = {}) {
  const stimulusOrMessage = message !== '' ? `<h3>${message}</h3>` : stimulus;

  // Countdown from time -> 0
  const timeline = range(time, 0, -1).map((n) => ({ prompt: `<h1>${n}</h1>` }));

  return {
    type: htmlKeyboardResponse,
    stimulus: stimulusOrMessage,
    trial_duration: duration,
    response_ends_trial: false,
    timeline: timeline,
  };
}

// TODO 212: I don't know if this sets the values correctly as i think?
export const Countdown = createCountdownTrial();
