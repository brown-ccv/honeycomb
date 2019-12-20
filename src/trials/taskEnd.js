import { eventCodes, IS_ELECTRON, AT_HOME } from '../config/main'
import { earningsDisplay } from '../lib/markup/earnings'
import { photodiodeGhostBox, pdSpotEncode } from '../lib/markup/photodiode'

const beadEnd = (trialDetails, duration) => {
    const code = eventCodes.show_earnings

    return {
      type: 'html_keyboard_response',
      stimulus: '',
      response_ends_trial: false,
      trial_duration: duration,
      on_load: () => pdSpotEncode(code),
      on_start: (trial) => {
        let earnings = Math.random()
        trial.stimulus = earningsDisplay(earnings)
        if (IS_ELECTRON && !AT_HOME) trial.stimulus += photodiodeGhostBox()
      },
      on_finish: (data) => data.code = code
    }
}

export default beadEnd
