import { defaultBlockSettings, payout, chooseRandomColor, lang } from './main';
import { deepCopy } from '../lib/utils'

// FIRST EXPERIMENT BLOCK SETTINGS

// create copy of default settings
let exptBlock1 = deepCopy(defaultBlockSettings)

exptBlock1.color_on_left = chooseRandomColor()
exptBlock1.starting_diffs = [ 1 ]

exptBlock1.repeats_per_condition = 2

exptBlock1.bead_settings[lang.color.blue] = payout.a.high
exptBlock1.bead_settings[lang.color.orange] = payout.a.low

// SECOND EXPERIMENT BLOCK SETTINGS

// create copy of default settings
let exptBlock2 = deepCopy(defaultBlockSettings)

exptBlock2.color_on_left = chooseRandomColor()
exptBlock2.starting_diffs = [ 1 ]

exptBlock2.repeats_per_condition = 2

exptBlock2.bead_settings[lang.color.blue] = payout.a.low
exptBlock2.bead_settings[lang.color.orange] = payout.a.high

export {
  exptBlock1,
  exptBlock2,
}
