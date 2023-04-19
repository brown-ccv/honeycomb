import { lang } from '../../config/main';

export default async function eventMarkerMessage() {
  return `<span style="color: green;">${lang.eventMarker.found}</span>`;
}
