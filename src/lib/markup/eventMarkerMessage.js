import { IS_ELECTRON, lang } from '../../config/main'

const eventMarkerMessage = async () => {
	if (IS_ELECTRON) {
		return `<span style="color: green;">${lang.eventMarker.found}</span>`
	}
	else {
		return `<span style="color: red;">${lang.eventMarker.not_found}</span>`
	}
}

export default eventMarkerMessage
