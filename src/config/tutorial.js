import { defaultBlockSettings, color, tutRand, payoutLow, payoutHigh } from './main';
import { deepCopy } from '../lib/utils'

// TUTORIAL SETTINGS

// create copy of default settings
let tutorialBlock = deepCopy(defaultBlockSettings)

// update default settings for tutorial
tutorialBlock.bet_lockout = 0

tutorialBlock.is_tutorial = true
tutorialBlock.photodiode_active = false

tutorialBlock.bead_settings[color.blue] = payoutHigh
tutorialBlock.bead_settings[color.orange] = payoutLow

// randomly assign low and high payouts to colors
if ( tutRand ) {
	tutorialBlock.bead_settings[color.blue] = payoutLow
	tutorialBlock.bead_settings[color.orange] = payoutHigh
}

// export the settings
export default [tutorialBlock]
