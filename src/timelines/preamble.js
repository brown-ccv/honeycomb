import { jsPsych } from 'jspsych-react'
import { eventCodes, lang } from '../config/main'
import holdUpMarker from '../trials/holdUpMarker'
import {showMessage, userId} from '@brown-ccv/behavioral-task-trials'
import { config, AT_HOME } from '../config/main'
console.log(showMessage('html_button_response',undefined, config,lang.task.name, false, true, undefined, undefined, [lang.prompt.continue.button]))
console.log('at_home', AT_HOME)
console.log('env at home', process.env.REACT_APP_AT_HOME)
const preamble = {
  type: 'html_keyboard_response',
  stimulus: '',
  timeline: (!config.USE_PHOTODIODE) ?
    [showMessage('html_button_response',undefined, config,`<h1>${lang.task.name}</h1>`, false, true, undefined, undefined, [lang.prompt.continue.button]),
    // [{type: "html_keyboard_response", stimulus: `<h1>Hello</h1>`, trial_duration: 100, response_ends_trial: false},
     userId(jsPsych, 'html_keyboard_response', 800, config, lang.userid.set, undefined, process.env.REACT_APP_PATIENT_ID)] :

    [showMessage('html_button_response',undefined, config,`<h1>${lang.task.name}</h1>`, false, true, undefined, undefined, [lang.prompt.continue.button]), 
    userId(jsPsych, 'html_keyboard_response', 800, config, lang.userid.set, undefined, process.env.REACT_APP_PATIENT_ID), 
    holdUpMarker(), 
    showMessage('html_keyboard_response',2000, config,`<h1>${lang.prompt.setting_up}</h1>`, false, undefined, eventCodes.open_task, eventCodes.open_task)]
}

export default preamble
