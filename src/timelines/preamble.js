import holdUpMarker from "../trials/holdUpMarker";
import startCode from "../trials/startCode";
import welcome from "../trials/welcome";
import adjustVolume from "../trials/adjustVolume";
import {USE_EVENT_MARKER, VOLUME} from "../config/main";

let timeline = []
  if (VOLUME) {
    timeline.push(adjustVolume())
  }
  if (USE_EVENT_MARKER) {
    timeline.push(holdUpMarker())
    timeline.push(startCode())
  }
  timeline.push(welcome)


  const preamble = {
    type: "html_keyboard_response",
    stimulus: "",
    timeline: timeline
  };

export default preamble;
