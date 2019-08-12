import { eventCodes } from '../config/main'
import { jitter50 } from '../lib/utils'
import { pdSpotEncode, photodiodeGhostBox } from '../lib/markup/photodiode'
import { fixationHTML } from '../lib/markup/fixation'
import { jsPsych } from 'jspsych-react'

const fixation = (duration) => {
  let stimulus = fixationHTML + photodiodeGhostBox()

  const code = eventCodes.fixation;

  return {
    type: 'html_keyboard_response',
    choices: jsPsych.NO_KEYS,
    stimulus: stimulus,
    response_ends_trial: false,
    trial_duration: jitter50(duration),
    on_load: () => pdSpotEncode(code),
    on_finish: (data) => data.code = code
  }
}

export default fixation
