import { jsPsych } from 'jspsych-react'
import { randomTrue } from '../lib/utils'
import _ from 'lodash'
import { eventCodes } from './trigger'

const keys = {
	"A": 65,
	"B": 66,
	"C": 67,
	"F": 70,
	"J": 74,
	"space": 32
}

const MTURK = (!jsPsych.turk.turkInfo().outsideTurk)


// get language file
const lang = require('../language/en_us.json')
if (process.env.MTURK) {
  const mlang = require('../language/en_us.mturk.json')
	_.merge(lang, mlang)
}

const defaultBlockSettings = {
	draw_cost: -0.1, // cost of each draw in current block (Note: Should be negative as it is a cost!)
	bead_settings: {},
	button_key: {},
	num_starting_beads: 10, // total number of beads on the screen at the start of a trial
	starting_diffs: [-10, 0, 10, 2, 2, 2, 2], // array specifying the difference between orange and blue beads pre-drawn
	jar_color_fraction: 0.6, // fraction of jar that is blue
	bead_draw_limit: 1000, // number of beads that can be drawn in any trial in the block
	repeats_per_condition: 1, // number of times every difference in starting_diffs is repeated
	show_earnings: true,
	is_practice: false,
	is_tutorial: false,
	photodiode_active: false,
	min_draws: 10, // number of trials/mini-games they must draw at least once in
}

const payout = {
	a: {
		high: {
			correct: 20,
			wrong: -10
		},
		low: {
			correct: 10,
			wrong: -10
		}
	},
	b: {
		high: {
			correct: 70,
			wrong: -10
		},
		low: {
			correct: 10,
			wrong: -10
		}
	}
}


defaultBlockSettings.bead_settings[lang.color.blue] = payout.a.high
defaultBlockSettings.bead_settings[lang.color.orange] = payout.a.low

if ( randomTrue() ) {
      defaultBlockSettings.bead_settings[lang.color.blue] = payout.a.low
      defaultBlockSettings.bead_settings[lang.color.orange] = payout.a.high
}

// random color chooser
const chooseRandomColor = () => {
	return ( randomTrue() ) ? lang.color.orange : lang.color.blue
}


// which random path to take
const tutRand = randomTrue()

export {
	keys,
	defaultBlockSettings,
	payout,
	chooseRandomColor,
	tutRand,
	lang,
	eventCodes,
	MTURK
}
