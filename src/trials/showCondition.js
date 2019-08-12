import { eventCodes } from '../config/main'
import { baseStimulus } from '../lib/markup/stimuli'
import { photodiodeGhostBox, pdSpotEncode } from '../lib/markup/photodiode'

const showCondition = (condition, duration, timeBeforeUpdate) => {
  const code = eventCodes.evidence

  return {
    type: 'html_keyboard_response',
    stimulus: '',
    response_ends_trial: false,
    trial_duration: duration,
    on_start: (trial) => {
      trial.stimulus = baseStimulus(condition)
                      + photodiodeGhostBox()
    },
    on_load: () => pdSpotEncode(code),
    on_finish: (data) => data.code = code
  }
}

export default showCondition
