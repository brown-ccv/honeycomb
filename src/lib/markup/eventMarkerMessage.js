import { language } from "../../config/main";

// TODO: Change based on whether or not the event marker is found?
const eventMarkerMessage = async () => {
  return `<span style="color: green;">${language.trials.eventMarker.found}</span>`;
};

export default eventMarkerMessage;
