import $ from "jquery";
import { config } from "../../config/main";
import { eventCodes } from "../../config/trigger";
import { div, span } from "./tags";

/**
 * Displays a box in the bottom right corner of the screen with the id "photodiode-spot"
 */
function photodiodeGhostBox() {
  const spot = span("", { id: "photodiode-spot", class: "photodiode-spot" });
  return div(spot, {
    id: "photodiode-box",
    // Photodiode is only visible if config.USE_PHOTODIODE is true
    class: config.USE_PHOTODIODE ? "photodiode-box visible" : "photodiode-box invisible",
  });
}

/**
 * Repeatedly flashes a spot inside the photodiodeGhostBox and communicates with the USB port
 *
 * Note that this trial is only available when running in Electron
 *
 * @param {*} taskCode The code to be sent to the USB port (Electron only)
 */
function photodiodeSpot(taskCode) {
  // Conditionally load electron based on config variable
  if (!config.USE_ELECTRON) {
    throw new Error("photodiodeSpot trial is only available when running inside Electron");
  }

  // Pulse the spot color from black to white
  // TODO: Pulse between visible and invisible?
  function pulseFor(ms, callback) {
    $(".photodiode-spot").css({ "background-color": "black" });
    setTimeout(() => {
      $(".photodiode-spot").css({ "background-color": "white" });
      callback();
    }, ms);
  }

  // Repeat pulseFor i times
  function repeatPulseFor(ms, i) {
    if (i > 0) {
      pulseFor(ms, () => {
        setTimeout(() => {
          repeatPulseFor(ms, i - 1);
        }, ms);
      });
    }
  }

  if (config.USE_PHOTODIODE) {
    // TODO: Pass blinkTime as config setting
    const blinkTime = 40;
    let numBlinks = taskCode;

    // TODO?: Legacy, can it be removed?
    if (taskCode < eventCodes.open_task) numBlinks = 1;

    repeatPulseFor(blinkTime, numBlinks);
    window.electronAPI.photodiodeTrigger(taskCode);
  }
}

export { photodiodeGhostBox, photodiodeSpot };
