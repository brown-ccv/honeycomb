import { MTURK } from  '../../config/main'
import $ from 'jquery'

// Relies on styling in App.css, generate PD spot
const photodiodeGhostBox = () => {
	const class_ = (MTURK) ? 'invisible' : 'visible'

  const markup = `<div class="photodiode-box ${class_}" id="photodiode-box">
									<span id="photodiode-spot" class="photodiode-spot"></span>
  								</div>`
	return markup
}

const pdSpotEncode = (taskCode) => {
	if (!MTURK) {
		const blinkTime = taskCode * 10
		for (var i = 0; i < taskCode; i++) {
			$('#photodiode-spot').delay(blinkTime).hide(0).delay(blinkTime).show(0)
		}
	}
}

export {
	photodiodeGhostBox,
	pdSpotEncode
}
