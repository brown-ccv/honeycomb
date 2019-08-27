import { MTURK } from  '../../config/main'
import $ from 'jquery'

// conditionally load electron and psiturk based on MTURK config variable
const isElectron = !MTURK
let ipcRenderer = false;
if (isElectron) {
  const electron = window.require('electron');
  ipcRenderer  = electron.ipcRenderer;
}

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
		const blinkTime = 20
		for (var i = 0; i < taskCode; i++) {
			$('#photodiode-spot').delay(blinkTime).hide(0).delay(blinkTime).show(0)
		}
		if ( ipcRenderer ) ipcRenderer.send('trigger', taskCode)
	}
}

export {
	photodiodeGhostBox,
	pdSpotEncode
}
