import { lang } from '../config/main'
import { photodiodeGhostBox } from '../lib/markup/photodiode'
import { baseStimulus } from '../lib/markup/stimuli'
import eventMarkerMessage from '../lib/markup/eventMarkerMessage'

const zoom = () => {
  const stimulus = baseStimulus(`<div><h1>${lang.prompt.zoom}</h1><h2 id='usb-alert'></h2></div>`, true) + photodiodeGhostBox()

   return {
    type: 'html_keyboard_response',
    stimulus: stimulus,
    prompt: [lang.prompt.continue.press],
    on_load: () => (eventMarkerMessage()
                      .then(s => document.getElementById('usb-alert')
                      .innerHTML = s )
                    )

  }
}

export default zoom
