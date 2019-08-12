import _ from 'lodash'
import { lang } from '../config/main'
import { jsPsych } from 'jspsych-react'

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

// shuffle the items in an array randomly
const shuffleArray = (array) => {
  let currentIndex = array.length
  let temporaryValue, randomIndex
  // While there remain elements to shuffle
  while (0 !== currentIndex) {
    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    // And swap it with the current element
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
}

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

const images = importAll(require.context('../assets/images', false, /\.(png|jpe?g|svg)$/));

const oppositeColor = (colour) => {
  const colours = _.values(lang.color)
  return _.pull(colours, colour)[0]
}

const getTurkUniqueId = () => {
  const turkInfo = jsPsych.turk.turkInfo()
  const uniqueId = `${turkInfo.workerId}:${turkInfo.assignmentId}`
  return uniqueId
}

const getUserId = (data, blockSettings) => {
  blockSettings.patiendId = JSON.parse(data.responses)['Q0']
  jsPsych.data.addProperties({patient_id: blockSettings.patiendId, timestamp: Date.now()})
  console.log("ID", blockSettings.patiendId)
}

export {
  jitter,
  jitter50,
  randomTrue,
  deepCopy,
  formatDollars,
  shuffleArray,
  generateWaitSet,
  images,
  startKeypressListener,
  oppositeColor,
  getUserId,
  getTurkUniqueId
}
