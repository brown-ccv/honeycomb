import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import { h1 } from "../../lib/markup/tags";
import { getTimeString } from "../../lib/utils";

/**
 * a sample countdown trial that counts down ms before another trial begins
 *
 * @param {number} ms - millisecond to countdown
 * @returns a JS object as a trial
 */
export function buildCountdownTrial(waitTime) {
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
