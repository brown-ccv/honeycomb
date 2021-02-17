// config/main.js
// This is the main configuration file where universal and default settings should be placed.
// These settins can then be imported anywhere in the app as they are exported at the botom of the file.

import { jsPsych } from 'jspsych-react'
import _ from 'lodash'
import { eventCodes } from './trigger'
import {init} from '@brown-ccv/behavioral-task-trials'

// mapping of letters to key codes
const keys = {
	"A": 65,
	"B": 66,
	"C": 67,
	"F": 70,
	"J": 74,
	"space": 32
}

// audio codes
const audioCodes = {
	frequency: 100*(eventCodes.open_task - 9),
	type: 'sine'
}

// is this mechanical turk?
const MTURK = (!jsPsych.turk.turkInfo().outsideTurk)
const AT_HOME = (process.env.REACT_APP_AT_HOME === 'true')
let IS_ELECTRON = true

try {
	window.require('electron')
} catch {
	IS_ELECTRON = false
}

// get language file
const lang = require('../language/en_us.json')
if (MTURK) { // if this is mturk, merge in the mturk specific language
  const mlang = require('../language/en_us.mturk.json')
	_.merge(lang, mlang)
}

const defaultBlockSettings = {
	conditions: ["a", "b", "c"],
	repeats_per_condition: 1, // number of times every condition is repeated
	is_practice: false,
	is_tutorial: false,
	photodiode_active: false
}

// setting config for trials
const config = init({USE_PHOTODIODE: !AT_HOME && IS_ELECTRON,  USE_EEG: false, USE_ELECTRON: IS_ELECTRON, USE_MTURK: MTURK})

export {
	keys,
	defaultBlockSettings,
	lang,
	eventCodes,
	config,
	AT_HOME,
	audioCodes
}
