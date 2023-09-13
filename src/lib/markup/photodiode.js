import { config } from "../../config/main";
import { eventCodes } from "../../config/trigger";
import $ from "jquery";

// Relies on styling in App.css, generate PD spot
// TODO: Make a constant, not function
const photodiodeGhostBox = () => {
  const class_ = config.USE_PHOTODIODE ? "visible" : "invisible";

  const markup = `<div class="photodiode-box ${class_}" id="photodiode-box">
      <span id="photodiode-spot" class="photodiode-spot" />
    </div>`;
  return markup;
};

const pdSpotEncode = (taskCode) => {
  // Conditionally load electron based on config variable
  let ipcRenderer = false;
  if (config.USE_ELECTRON) {
    const electron = window.require("electron");
    ipcRenderer = electron.ipcRenderer;
  }

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
    const blinkTime = 40;
    let numBlinks = taskCode;
    if (taskCode < eventCodes.open_task) numBlinks = 1;
    repeatPulseFor(blinkTime, numBlinks);
    if (ipcRenderer) ipcRenderer.send("trigger", taskCode);
  }
};

export { photodiodeGhostBox, pdSpotEncode };
