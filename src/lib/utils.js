import requireContext from 'require-context.macro'

// TODO: Comments for these utility functions

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

// As of jspsych 7, we instantiate jsPsych where needed instead of importing it globally.
// The jsPsych instance passed in here should be the same one used for the running task.
const startKeypressListener = (jsPsych) => {
  // Complete a trial on keypress - which key is pressed it recorded
  const keypressCallback = (info) => {
    jsPsych.finishTrial({key_press: info.key})
  }

  return jsPsych.pluginAPI.getKeyboardResponse({
    callback_function: keypressCallback,
    valid_responses: ['ALL_KEYS'],
    persist: false
  })
}

// Discover and import images in src/assets/images.
// This produces an object that maps friendly image file names to obscure webpack path names.
// For example:
//   {
//     image1.png: '/static/media/image1.5dca7a2a50fb8b633fd5.png',
//     image2.png: '/static/media/image2.5dca7a2a50fb8b633fd5.png'
//   }
const importAll = (r) => {
  const importImageByName = (allImages, imageName) => {
    const friendlyName = imageName.replace('./', '');
    return { ...allImages, [friendlyName]: r(imageName) };
  };
  return r.keys().reduce(importImageByName, {});
}

// TODO: This should probably be somewhere else? It's the images in assets/images not a function
const images = importAll(requireContext('../assets/images', false, /\.(png|jpe?g|svg)$/));

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

const getTurkUniqueId = (jsPsych) => {
  const turkInfo = jsPsych.turk.turkInfo()
  return `${turkInfo.workerId}:${turkInfo.assignmentId}`
}

const getProlificId = () => getQueryVariable("PROLIFIC_PID");

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

// Stolen from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

/**
 * Removes the cursor from the part of the screen covered by the specified element. When the user hovers over
 * the element, the cursor will disappear.
 * @param elementId The ID of the element to remove the cursor from.
 */
const removeCursor = (elementId) => {
  let element = document.getElementById(elementId);
  element.classList.add("nocursor");
};

/**
 * The opposite of removeCursor. Adds a cursor over a specified element.
 * @param elementId The element to add a cursor for.
 */
const addCursor = (elementId) => {
  let element = document.getElementById(elementId);
  element.classList.remove("nocursor");
};

// TODO: Export each function directly (all files)
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
  beep,
  getRandomInt,
  addCursor,
  removeCursor
}
