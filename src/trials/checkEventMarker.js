import { lang, config } from '../config/main'
import { baseStimulus } from '../lib/markup/stimuli'

const adjustVolume = () => {
    const stimulus = baseStimulus(`
    <div class='instructions'>
    <h1>${lang.instructions.check_event_marker}</h1>
    </div>
    `, true)
    
    return {
        type: 'html_keyboard_response',
        stimulus: stimulus,
        prompt:  lang.prompt.continue.press,
        response_ends_trial: true,
        on_load: () => {
            console.log('dkjlkkdlkd')
            if (config.USE_ELECTRON) {
                const ipcRenderer = window.require('electron').ipcRenderer
                ipcRenderer.send('checkEventMarker')
            }    
          },

    }
}

export default adjustVolume