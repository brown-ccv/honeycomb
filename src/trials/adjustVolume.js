import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response'
import { lang } from '../config/main'
import { baseStimulus } from '../lib/markup/stimuli'

/**
 * Ask the participant to adjust their machine's volume.
 * @returns {any} The jsPsych object for the trial.
 */
const adjustVolume = () => {
    const stimulus = baseStimulus(`
    <div class='instructions'>
    <h1>${lang.instructions.adjust_volume}</h1>
    </div>
    `, true)
    
    return {
        type: htmlKeyboardResponse,
        stimulus: stimulus,
        prompt:  lang.prompt.continue.press,
        response_ends_trial: true
    }
}

export default adjustVolume