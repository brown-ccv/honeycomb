import { lang } from '../config/main'
import { photodiodeGhostBox } from '../lib/markup/photodiode'
import { baseStimulus } from '../lib/markup/stimuli'

const experimentEnd = (duration) => {
  let stimulus = baseStimulus(`<h1>${lang.task.end}</h1>`, prompt=true) + photodiodeGhostBox()

   return {
    type: 'html_keyboard_response',
    stimulus: stimulus,
    duration: duration
  }
}

export default experimentEnd
