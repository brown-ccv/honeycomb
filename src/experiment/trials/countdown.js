import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import { h1 } from "../../lib/markup/tags";

/**
 * Returns millisecond to minute
 *
 * @param {*} ms - millisecond
 * @returns minute value
 */
function getMinute(ms) {
  return Math.floor(ms / 1000 / 60);
}

/**
 * Given total minute and total millisecond, return the seconds
 *
 * @param {*} ms - millisecond
 * @param {*} min - minute
 * @returns the seconds in number
 */
function getSeconds(ms, min) {
  return Math.floor((ms - min * 1000 * 60) / 1000);
}

/**
 * Gets a time in string format to display on screen
 *
 * @param {*} ms - millisecond
 * @returns return time string format as in 00:00
 */
function getTimeString(ms) {
  return `${getMinute(ms)}:${getSeconds(ms, getMinute(ms)).toString().padStart(2, "0")}`;
}

/**
 * a sample countdown trial that counts down ms before another trial begins
 *
 * @param {*} ms - millisecond to countdown
 * @returns a JS object as a trial
 */
export function buildCountdownTrial(ms) {
  const waitTime = ms;
  return {
    type: htmlKeyboardResponse,
    stimulus:
      h1("The next part of the experiment will start in") +
      h1(getTimeString(waitTime), {
        id: "clock",
      }),
    choices: "NO_KEYS",
    trial_duration: waitTime + 20,
    on_load: function () {
      const startTime = performance.now();
      const interval = setInterval(function () {
        const timeLeft = waitTime - (performance.now() - startTime);
        document.querySelector("#clock").innerHTML = getTimeString(timeLeft);
        if (timeLeft <= 0) {
          document.querySelector("#clock").innerHTML = "0:00";
          clearInterval(interval);
        }
      }, 250);
    },
  };
}
