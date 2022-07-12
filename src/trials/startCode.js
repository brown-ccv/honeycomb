import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response'
import { eventCodes, lang, audioCodes } from '../config/main'
import { photodiodeGhostBox, pdSpotEncode } from '../lib/markup/photodiode'
import { baseStimulus } from '../lib/markup/stimuli'
import { beep } from '../lib/utils'

const startCode = () => {
  let stimulus = baseStimulus(`<h1>${lang.prompt.setting_up}</h1>`, true) + photodiodeGhostBox()

   return {
    type: htmlKeyboardResponse,
    stimulus: stimulus,
    trial_duration: 2000,
    on_load: () => {
      pdSpotEncode(eventCodes.open_task)
      beep(audioCodes)
    }

  }
}

export default startCode
