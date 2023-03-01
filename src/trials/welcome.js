import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response'
import { LANGUAGE } from '../config/main'
import { photodiodeGhostBox } from '../lib/markup/photodiode'
import { baseStimulus } from '../lib/markup/stimuli'

const pleaseEnlargeWindow = () => {
  const stimulus = 
    baseStimulus(`<h1>${LANGUAGE.welcome.large_window}</h1>`, true) + 
    photodiodeGhostBox()

  return {
    type: htmlKeyboardResponse,
    stimulus: stimulus,
    prompt:  LANGUAGE.prompt.continue.press,
    response_ends_trial: true
  }
}

const welcomeMessage = () => {
  const stimulus = 
    baseStimulus(`<h1>${LANGUAGE.welcome.message}</h1>`, true) +
    photodiodeGhostBox()

  return {
    type: htmlKeyboardResponse,
    stimulus: stimulus,
    prompt:  LANGUAGE.prompt.continue.press,
    response_ends_trial: true
  }
}

const welcome = {
  type: htmlKeyboardResponse,
  timeline: [
    pleaseEnlargeWindow(),
    welcomeMessage()
  ]
}

export default welcome
