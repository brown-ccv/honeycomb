import holdUpMarker from "../trials/holdUpMarker";
import startCode from "../trials/startCode";
import welcome from "../trials/welcome";
import adjustVolume from "../trials/adjustVolume";
import camera from "../trials/camera";
import { config } from "../config/main";

let timeline = [];
if (config.USE_VOLUME) {
  timeline.push(adjustVolume());
}
if (config.USE_EEG) {
  timeline.push(holdUpMarker());
  timeline.push(startCode());
}
timeline.push(welcome);
if (config.USE_CAMERA) {
  timeline.push(camera());
}

const preamble = {
  type: "html_keyboard_response",
  stimulus: "",
  timeline: timeline,
};

export default preamble;
