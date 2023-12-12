import $ from "jquery";
import { config } from "../../config/main";
import { eventCodes } from "../../config/trigger";
import { div, span } from "./tags";

/**
 * Markup for a box in the bottom right corner of the screen and a photodiode spot inside the ghost box
 * Note the box will only be visible if USE_PHOTODIODE is true
 */
const photodiodeGhostBox = div(span("", { id: "photodiode-spot", class: "photodiode-spot" }), {
  id: "photodiode-box",
  // Photodiode is only visible if config.USE_PHOTODIODE is true
  class: config.USE_PHOTODIODE ? "photodiode-box visible" : "photodiode-box invisible",
});

/**
 * Conditionally flashes a spot inside the photodiodeGhostBox
 *
 * Note that this function must be executed inside the "on_load" callback of a trial
 * @param {number} taskCode The unique code for the given trial on which this function executes
 */
function pdSpotEncode(taskCode) {
  // Conditionally load electron based on config variable
  let ipcRenderer = false;
  if (config.USE_ELECTRON) {
    const electron = window.require("electron");
    ipcRenderer = electron.ipcRenderer;
  } else throw new Error("pdSpotEncode trial is only available when running inside Electron");

  // Conditionally pulse the photodiode and send event codes
  if (config.USE_PHOTODIODE) {
    // TODO #333: Get blink time from config.json (40ms is the default)
    // TODO #354: numBlinks in trigger config too
    const blinkTime = 40;
    let numBlinks = taskCode;
    if (taskCode < eventCodes.open_task) numBlinks = 1;
    repeatPulseFor(blinkTime, numBlinks);
    if (ipcRenderer) ipcRenderer.send("trigger", taskCode);
  }

  /**
   * Pulses the photodiode spot from black (on) to white (off) and runs a callback function
   * @param {number} ms The amount of time to flash the photodiode spot
   * @param {function} callback A callback function to execute after the flash
   */
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
