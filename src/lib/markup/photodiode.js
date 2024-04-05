import { config } from "../../config/main";
import { div, span } from "./tags";

// TODO @brown-ccv #329: Refactor photodiode logic to be a custom jsPsych extension

// The id of the photodiode elements (see trials.css)
const BOX_ID = "photodiode-box";
const SPOT_ID = "photodiode-spot";

/**
 * Markup for a box in the bottom right corner of the screen and a photodiode spot inside the ghost box
 *
 * Note the box will only be visible if USE_PHOTODIODE is true
 * Note that this trial is only available when running in Electron
 */
export const photodiodeGhostBox = div(span("", { id: SPOT_ID }), { id: BOX_ID });

/**
 * Conditionally flashes a spot inside the photodiodeGhostBox and sends event codes to the serial port
 *
 * Note that this function must be executed inside the "on_load" callback of a trial
 * @param {number} taskCode The unique code for the given trial on which this function executes
 */
export function pdSpotEncode(taskCode) {
  if (!config.USE_ELECTRON) {
    throw new Error("photodiodeSpot trial is only available when running inside Electron");
  }

  if (config.USE_PHOTODIODE) {
    // TODO @brown-ccv #333: Get blink time from config.json (equipment.trigger_box.event_codes) (40ms is the default)
    const blinkTime = 40;
    // TODO @brown-ccv #354: Gen numBlinks from config.json (equipment.trigger_box.event_codes) (40ms is the default)
    let numBlinks = taskCode;
    repeatPulseFor(blinkTime, numBlinks);
    window.electronAPI.photodiodeTrigger(taskCode);
  }

  /**
   * Pulses the photodiode spot from visible to white invisible and runs a callback function
   * @param {number} ms The amount of time to flash the photodiode spot
   * @param {function} callback A callback function to execute after the flash
   */
  // TODO @brown-ccv #425: Prevent trial from changing until pdSpotEncode finishes (need to use jsPsych.pluginAPI.setTimeout) https://www.jspsych.org/7.0/reference/jspsych-pluginAPI/#jspsychpluginapiclearalltimeouts
  function pulseFor(msVisible, callback) {
    const photodiodeSpot = document.getElementById(SPOT_ID);
    // TODO @brown-ccv #425: This should error once we handle the timeout correctly
    if (!photodiodeSpot) return;

    photodiodeSpot.style.visibility = "visible";
    setTimeout(() => {
      photodiodeSpot.style.visibility = "hidden";
      callback();
    }, msVisible);
  }

  /**
   * Recursive function that executes the pulseFor function i times
   * @param {number} ms The amount of time to flash the photodiode spot and wait before recursion
   * @param {number} i The number of times to repeat
   */
  function repeatPulseFor(ms, i) {
    if (i > 0) {
      pulseFor(ms, () => {
        setTimeout(() => {
          repeatPulseFor(ms, i - 1);
        }, ms);
      });
    }
  }
}
