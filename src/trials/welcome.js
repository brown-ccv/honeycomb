import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response'
import { lang } from '../config/main'
import { photodiodeGhostBox } from '../lib/markup/photodiode'
import { baseStimulus } from '../lib/markup/stimuli'

const pleaseBiggen = () => {
  var stimulus = baseStimulus(`<h1>${lang.welcome.large_window}</h1>`, true) +
                 photodiodeGhostBox()

  return {
    type: htmlKeyboardResponse,
    stimulus: stimulus,
    prompt:  lang.prompt.continue.press,
    response_ends_trial: true
  }
}

const welcomeMessage = () => {
  var stimulus = baseStimulus(`<h1>${lang.welcome.message}</h1>`, true) +
                 photodiodeGhostBox()

  return {
    type: htmlKeyboardResponse,
    stimulus: stimulus,
    prompt:  lang.prompt.continue.press,
    response_ends_trial: true
  }
}

const welcome = {
  type: htmlKeyboardResponse,
  timeline: [
    pleaseBiggen(),
    welcomeMessage()
  ]
}

export default welcome
