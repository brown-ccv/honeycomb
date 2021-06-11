import { lang, VIDEO } from '../config/main'
import { photodiodeGhostBox } from '../lib/markup/photodiode'
import { baseStimulus } from '../lib/markup/stimuli'

const experimentEnd = (duration) => {
  let stimulus = baseStimulus(`<h1>${lang.task.end}</h1>`, true) + photodiodeGhostBox()

   return {
    type: 'html_keyboard_response',
    stimulus: stimulus,
    trial_duration: duration,
    on_load: () => {
      if (VIDEO) {
        console.log('finished')
        try {
          window.cameraCapture.stop()
          window.screenCapture.stop()
        } catch (error) {
          window.alert("Your video recording was not saved")
        }
        
      }
    }
  }
}

export default experimentEnd
