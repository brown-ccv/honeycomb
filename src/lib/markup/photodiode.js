import $ from "jquery";
import { config } from "../../config/main";
import { div, span } from "./tags";

/**
 * Displays a box in the bottom right corner of the screen with the id "photodiode-spot"
 * The box is only visible if config.USE_PHOTODIODE is true
 */
function photodiodeGhostBox() {
  const spot = span("", { id: "photodiode-spot", class: "photodiode-spot" });
  return div(spot, {
    id: "photodiode-box",
    class: config.USE_PHOTODIODE ? "photodiode-box visible" : "photodiode-box invisible",
  });
}

/**
 * Repeatedly flashes a spot inside the photodiodeGhostBox and communicates with the USB port
 *
 * Note that this trial is only available when running in Electron
 *
 * @param {number} taskCode The code to be sent to the USB port (Electron only)
 */
function photodiodeSpot(taskCode) {
  if (!config.USE_ELECTRON) {
    throw new Error("photodiodeSpot trial is only available when running inside Electron");
  }

  // Pulse the spot color from black to white
  // TODO: Pulse between visible and invisible
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

    repeatPulseFor(blinkTime, taskCode);
    window.electronAPI.photodiodeTrigger(taskCode);
  }
}

export { photodiodeGhostBox, photodiodeSpot };
