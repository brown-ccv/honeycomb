import htmlButtonResponse from '@jspsych/plugin-html-button-response'
import { LANGUAGE } from '../config/main'
import { photodiodeGhostBox } from '../lib/markup/photodiode'
import { baseStimulus } from '../lib/markup/stimuli'
import eventMarkerMessage from '../lib/markup/eventMarkerMessage'

const holdUpMarker = () => {
  let stimulus = baseStimulus(`<div><h2 id='usb-alert'></h2></div>`, true) + photodiodeGhostBox()

   return {
    type: htmlButtonResponse,
    stimulus: stimulus,
    prompt: [`<br><h3>${LANGUAGE.prompt.focus}</h3>`],
    choices: [LANGUAGE.prompt.continue.button],
    on_load: () => (eventMarkerMessage()
                      .then(s => document.getElementById('usb-alert')
                      .innerHTML = s )
                    )
  }
}

export default holdUpMarker
