import { lang } from '../config/main'
import { photodiodeGhostBox } from '../lib/markup/photodiode'
import { baseStimulus } from '../lib/markup/stimuli'

const experimentStart = () => {
  let stimulus = baseStimulus(`<h1>${lang.task.name}</h1>`, prompt=true) + photodiodeGhostBox()

   return {
    type: 'html_button_response',
    stimulus: stimulus,
    choices: [lang.prompt.continue.button],
    prompt: [ `<h3>${lang.prompt.fullscreen}</h3>`]
  }
}

export default experimentStart
