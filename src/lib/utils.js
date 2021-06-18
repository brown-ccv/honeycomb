import { jsPsych } from 'jspsych-react'
import requireContext from 'require-context.macro'

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// add a random number between 0 and offset to the base number
const jitter = (base, offset) => (
  base + Math.floor(Math.random() * Math.floor(offset))
)

// add a random number between 0 and 50 to the base number
const jitter50 = (base) => jitter(base, 50)

// flip a coin
const randomTrue = () => Math.random() > 0.5

// deeply copy an object
const deepCopy = (obj) => JSON.parse(JSON.stringify(obj))

// format a number as a dollar amount
const formatDollars = (amount) => '$' + parseFloat(amount).toFixed(2)


// create a pre-trial wait period
const generateWaitSet = (trial, waitTime) => {
  let waitTrial = Object.assign({}, trial)
  waitTrial.trial_duration = waitTime
  waitTrial.response_ends_trial = false
  waitTrial.prompt = '-'

  return [waitTrial, trial]
}

const keypressResponse = (info) => {
  const data = {
    key_press: info.key
  }

  jsPsych.finishTrial(data)
}

const startKeypressListener = () => {
  let keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
    callback_function: keypressResponse,
    valid_responses: jsPsych.ALL_KEYS,
    persist: false
  })

  return keyboardListener
}

// import images
const importAll = (r) => {
  return r.keys().map(r);
}

const images = importAll(requireContext('../assets/images', false, /\.(png|jpe?g|svg)$/));

const getTurkUniqueId = () => {
  const turkInfo = jsPsych.turk.turkInfo()
  const uniqueId = `${turkInfo.workerId}:${turkInfo.assignmentId}`
  return uniqueId
}

const getQueryVariable = (variable) => {
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) === variable) {
      return decodeURIComponent(pair[1]);
    }
  }
};

const getProlificId = () => {
  const prolificId = getQueryVariable("PROLIFIC_PID");
  return prolificId
};

const beep = (audioCodes) => {
  const context = new AudioContext()
  const o = context.createOscillator()
  const g = context.createGain()
  o.type = audioCodes.type
  o.connect(g)
  o.frequency.setValueAtTime(audioCodes.frequency, 0)
  console.log(context.currentTime)
  g.connect(context.destination)
  o.start()
  o.stop(context.currentTime + 0.4)
}


export {
  sleep,
  jitter,
  jitter50,
  randomTrue,
  deepCopy,
  formatDollars,
  generateWaitSet,
  images,
  startKeypressListener,
  getProlificId,
  getTurkUniqueId,
  beep
}
