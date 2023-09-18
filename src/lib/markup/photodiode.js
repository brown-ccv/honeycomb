import { config } from "../../config/main";
import { eventCodes } from "../../config/trigger";
import $ from "jquery";
import { div, span } from "./tags";

function photodiodeGhostBox() {
  const spot = span("", { id: "photodiode-spot", class: "photodiode-spot" });
  return div(spot, {
    id: "photodiode-box",
    // Photodiode is only visible if config.USE_PHOTODIODE is true
    class: config.USE_PHOTODIODE ? "photodiode-box visible" : "photodiode-box invisible",
  });
}

// TODO: Rename as photodiodeSpot
function photodiodeSpot(taskCode) {
  // Conditionally load electron based on config variable
  let ipcRenderer = false;
  if (config.USE_ELECTRON) {
    const electron = window.require("electron");
    ipcRenderer = electron.ipcRenderer;
  } else throw new Error("photodiodeSpot trial is only available when running inside Electron");

  // Pulse the spot color from black to white
  function pulseFor(ms, callback) {
    $(".photodiode-spot").css({ "background-color": "black" });
    setTimeout(() => {
      $(".photodiode-spot").css({ "background-color": "white" });
      callback();
    }, ms);
  }

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
    const blinkTime = 40; // TODO: Get blink time based off fixation time?
    let numBlinks = taskCode;
    if (taskCode < eventCodes.open_task) numBlinks = 1;
    repeatPulseFor(blinkTime, numBlinks);
    if (ipcRenderer) ipcRenderer.send("trigger", taskCode);
  }
}

export { photodiodeGhostBox, photodiodeSpot };
