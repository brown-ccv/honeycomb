import { eventCodes } from '../config/main'
import { beadsMarkup } from '../lib/markup/beads'
import { photodiodeGhostBox, pdSpotEncode } from '../lib/markup/photodiode'
import { getTagId, appendBead, sendBeadCode, saveData } from '../lib/beadsUtils'
import jsPsych from 'jspsych-react'

const showBeads = (blockSettings, blockDetails, trialDetails, duration, timeBeforeUpdate) => {
  const popCode = eventCodes.bead_pop

  return {
    type: 'html_keyboard_response',
    stimulus: '',
    response_ends_trial: false,
    trial_duration: duration,
    on_start: (trial) => {
      let blues = trialDetails.prev_num_blue_beads
      let oranges = trialDetails.prev_num_orange_beads

      trial.stimulus = beadsMarkup(oranges, blues, blockSettings.color_on_left, 180, 120)
                      + photodiodeGhostBox()
    },
    on_load: () => {
      // send initial or updated evidence code, switch pop to true if bead popped (bead was drawn)
      const pop = sendBeadCode(blockSettings, trialDetails)
      const id = getTagId(blockSettings, trialDetails)
      setTimeout(() => {
        // send pop code if bead was popped
        if (pop) pdSpotEncode(popCode)
        appendBead(id)
      }, timeBeforeUpdate);
    },
    on_finish: (data) => data.code = popCode
  }
}

export default showBeads
