import { language } from '../../JsPsych/language';

// TODO 162: Have a markup.js file, consolidate these other files
async function eventMarkerMessage() {
  return `<span style="color: green;">${language.eventMarker.found}</span>`;
}

export default eventMarkerMessage;
