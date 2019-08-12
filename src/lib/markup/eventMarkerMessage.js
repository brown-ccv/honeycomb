import { MTURK, lang } from '../../config/main'

const eventMarkerMessage = async () => {
	if (!MTURK) {
		return `<span style="color: green;">${lang.eventMarker.found}</span>`
	}
	else {
		return `<span style="color: red;">${lang.eventMarker.not_found}</span>`
	}
}

export default eventMarkerMessage
