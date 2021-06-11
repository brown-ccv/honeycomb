import holdUpMarker from "../trials/holdUpMarker";
import startCode from "../trials/startCode";
import welcome from "../trials/welcome";
import adjustVolume from "../trials/adjustVolume";
import camera from "../trials/camera";
import { USE_EVENT_MARKER, VOLUME, VIDEO } from "../config/main";

let timeline = [];
if (VOLUME) {
  timeline.push(adjustVolume());
}
if (USE_EVENT_MARKER) {
  timeline.push(holdUpMarker());
  timeline.push(startCode());
}
timeline.push(welcome);
if (VIDEO) {
  timeline.push(camera());
}

const preamble = {
  type: "html_keyboard_response",
  stimulus: "",
  timeline: timeline,
};

export default preamble;
