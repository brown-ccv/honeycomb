import { language } from "../../config/main";

const eventMarkerMessage = async () => {
  return `<span style="color: green;">${language.eventMarker.found}</span>`;
};

export default eventMarkerMessage;
