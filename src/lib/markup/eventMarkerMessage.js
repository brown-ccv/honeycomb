import { lang } from '../../config/main';

// TODO 162: Have a markup.js file, consolidate these other files
async function eventMarkerMessage() {
  return `<span style="color: green;">${lang.eventMarker.found}</span>`;
}

export default eventMarkerMessage;
