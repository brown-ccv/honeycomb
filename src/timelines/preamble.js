import { jsPsych } from 'jspsych-react'
import { eventCodes, lang } from '../config/main'
import holdUpMarker from '../trials/holdUpMarker'
import {showMessage, userId} from '@brown-ccv/behavioral-task-trials'
import { config, AT_HOME } from '../config/main'

console.log('at_home', AT_HOME)
console.log('env at home', process.env.REACT_APP_AT_HOME)
const preamble = {
  type: 'html_keyboard_response',
  stimulus: '',
  timeline: (!config.USE_PHOTODIODE) ?
    [showMessage('html_button_response',undefined, config,lang.task.name, true, undefined, undefined, [lang.prompt.continue.button]),
     userId(jsPsych, 'html_keyboard_response', 800, config, lang.userid.set, undefined, process.env.REACT_APP_PATIENT_ID)] :

    [showMessage('html_button_response',undefined, config,lang.task.name, true, undefined, undefined, [lang.prompt.continue.button]), 
    userId(jsPsych, 'html_keyboard_response', 800, config, lang.userid.set, undefined, process.env.REACT_APP_PATIENT_ID), 
    holdUpMarker(), 
    showMessage('html_keyboard_response',2000, config,lang.prompt.setting_up, undefined, eventCodes.open_task)]
}

export default preamble
