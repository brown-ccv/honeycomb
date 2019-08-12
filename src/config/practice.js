import { defaultBlockSettings, color, tutRand, payoutLow, payoutHigh, chooseRandomColor } from './main';
import { deepCopy, randomTrue } from '../lib/utils'

// PRACTICE BLOCK SETTINGS

// create copy of default settings
let pracBlock = deepCopy(defaultBlockSettings)
pracBlock.color_on_left = chooseRandomColor()

// first practice trial has starting diff of -5 (left side has 5 less than right side), etc. ...
pracBlock.starting_diffs = [-5, 0, 3]

// currently practice block shuffles through each starting_diff (i.e. is randomized each time, which is good)
pracBlock.repeats_per_condition = 1

pracBlock.is_practice = true

if ( tutRand ) {
	pracBlock.bead_settings[color.blue] = payoutLow
	pracBlock.bead_settings[color.orange] = payoutHigh
}

if ( tutRand & randomTrue() ) {
	pracBlock.bead_settings[color.blue] = payoutHigh
	pracBlock.bead_settings[color.orange] = payoutLow
} else if ( !tutRand & randomTrue() ) {
	pracBlock.bead_settings[color.blue] = payoutLow
	pracBlock.bead_settings[color.orange] = payoutHigh
}

// export the settings
export default [pracBlock]
