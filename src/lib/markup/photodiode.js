import $ from "jquery";
import { config } from "../../config/main";
import { div, span } from "./tags";

/**
 * Markup for a box in the bottom right corner of the screen and a photodiode spot inside the ghost box
 *
 * Note the box will only be visible if USE_PHOTODIODE is true
 * Note that this trial is only available when running in Electron
 */
const photodiodeGhostBox = div(span("", { id: "photodiode-spot", class: "photodiode-spot" }), {
  id: "photodiode-box",
  class: "photodiode-box",
});

/**
 * Conditionally flashes a spot inside the photodiodeGhostBox and sends event codes to the serial port
 *
 * Note that this function must be executed inside the "on_load" callback of a trial
 * @param {number} taskCode The unique code for the given trial on which this function executes
 */
function pdSpotEncode(taskCode) {
  if (!config.USE_ELECTRON) {
    throw new Error("photodiodeSpot trial is only available when running inside Electron");
  }

  if (config.USE_PHOTODIODE) {
    const blinkTime = 40; // TODO #333: Get blink time from config.json (40ms is the default)
    let numBlinks = taskCode; // TODO #354: Encode numBlinks in the event marker config
    repeatPulseFor(blinkTime, numBlinks);
    window.electronAPI.photodiodeTrigger(taskCode);
  }

  /**
   * Pulses the photodiode spot from black (on) to white (off) and runs a callback function
   * @param {number} ms The amount of time to flash the photodiode spot
   * @param {function} callback A callback function to execute after the flash
   */
  // TODO #331: Single photodiode color, pulse between visible and invisible here
  function pulseFor(ms, callback) {
    $(".photodiode-spot").css({ "background-color": "black" });
    setTimeout(() => {
      $(".photodiode-spot").css({ "background-color": "white" });
      callback();
    }, ms);
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

export { photodiodeGhostBox, pdSpotEncode };
