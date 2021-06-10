// config/main.js
// This is the main configuration file where universal and default settings should be placed.
// These settins can then be imported anywhere in the app as they are exported at the botom of the file.

import { jsPsych } from 'jspsych-react'
import _ from 'lodash'
import { eventCodes } from './trigger'
import {init} from '@brown-ccv/behavioral-task-trials'
import { getProlificId } from '../lib/utils'

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

const taskName = "honeycomb template"

// is this mechanical turk?
const MTURK = (!jsPsych.turk.turkInfo().outsideTurk)
let PROLIFIC = getProlificId() && !MTURK;
let IS_ELECTRON = true;
let FIREBASE = process.env.REACT_APP_FIREBASE === "true";
const INSTRUCTIONS_QUIZ = process.env.REACT_APP_INSTRUCTIONS_QUIZ === "true"

try {
	window.require('electron')
} catch {
	IS_ELECTRON = false
}

// these variables depend on IS_ELECTRON
// whether or not to ask the participant to adjust the volume
const VOLUME = process.env.REACT_APP_VOLUME === "true";
// whether or not to enable video
const VIDEO = process.env.REACT_APP_VIDEO === "true" && IS_ELECTRON;
// whether or not the EEG/event marker is available
const USE_EVENT_MARKER =
  process.env.REACT_APP_USE_EVENT_MARKER === "true" && IS_ELECTRON;
// whether or not the photodiode is in use
const USE_PHOTODIODE =
  process.env.REACT_APP_USE_PHOTODIODE === "true" && IS_ELECTRON;

// get language file
const lang = require('../language/en_us.json')
if (!IS_ELECTRON) { // if this is mturk, merge in the mturk specific language
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
const config = init({USE_PHOTODIODE: USE_PHOTODIODE,  USE_EEG: false, USE_ELECTRON: IS_ELECTRON, USE_MTURK: MTURK})

export {
	taskName,
	keys,
	defaultBlockSettings,
	lang,
	eventCodes,
	config,
	MTURK,
	PROLIFIC,
	FIREBASE,
	VOLUME,
	VIDEO,
	USE_EVENT_MARKER,
	USE_PHOTODIODE,
	IS_ELECTRON,
	INSTRUCTIONS_QUIZ,
	audioCodes
}
