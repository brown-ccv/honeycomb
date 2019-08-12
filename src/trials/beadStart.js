import { eventCodes } from '../config/main'
import { photodiodeGhostBox, pdSpotEncode } from '../lib/markup/photodiode'
import { moneyBags } from '../lib/markup/moneyBags'
import { jsPsych } from 'jspsych-react'

const beadStart = (blockSettings, duration) => {
  let stimulus = moneyBags(blockSettings) + photodiodeGhostBox()

  const code = eventCodes.show_money

  return {
    type: 'html_keyboard_response',
    choices: jsPsych.NO_KEYS,
    stimulus: stimulus,
    response_ends_trial: false,
    trial_duration: duration,
    on_load: () => pdSpotEncode(code),
    on_finish: (data) => data.code = code
    }
}

export default beadStart
