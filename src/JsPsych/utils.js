// Utility Functions
import requireContext from 'require-context.macro';

/**
 * Delay program execution
 * @param {number} ms Time to sleep for in milliseconds
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Add a random number between 0 and offset to the base number
 * @param {number} base Starting number
 * @param {number} offset Maximum jitter offset
 * @returns
 */
export function jitter(base, offset) {
  return base + Math.floor(Math.random() * Math.floor(offset));
}

/**
 * Add a random number between 0 and 50 to the base number
 * @param {number} base Starting number
 */
export function jitter50(base) {
  return jitter(base, 50);
}

/**
 * Flips a coin
 */
export function randomTrue() {
  return Math.random() > 0.5;
}

/**
 * Copies a deeply nested object
 * @param {Object} obj Object to be copied
 */
export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Format a number as a US dollar amount
 * @param {number} amount Dollar amount
 */
export function formatDollars(amount) {
  return '$' + parseFloat(amount).toFixed(2);
}

/**
 * Adds a wait period before a trial begins
 * @param {*} trial The trial to add a wait period to
 * @param {*} waitTime The amount of time to wait by
 */
// TODO 162: This should be a trial not a utility? It's adding a separate trial in and of itself
export function generateWaitSet(trial, waitTime) {
  const waitTrial = Object.assign({}, trial);
  waitTrial.trial_duration = waitTime;
  waitTrial.response_ends_trial = false;
  waitTrial.prompt = '-';

  return [waitTrial, trial];
}

/**
 * Starts the JsPsych keyboard response listener
 * @param  jsPsych The jsPsych instance running the task.
 */
export function startKeypressListener(jsPsych) {
  function keypressResponse(info) {
    const data = { key_press: info.key };
    jsPsych.finishTrial(data);
  }

  const keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
    callback_function: keypressResponse,
    valid_responses: ['ALL_KEYS'],
    persist: false,
  });

  return keyboardListener;
}

/**
 * Discover and import images in src/assets/images.
 * This produces an object that maps friendly image file names to obscure webpack path names.
 *  For example:
 *    {
 *      image1.png: '/static/media/image1.5dca7a2a50fb8b633fd5.png',
 *      image2.png: '/static/media/image2.5dca7a2a50fb8b633fd5.png'
 *    }
 * @param {Object} r
 * @returns
 */
export function importAll(r) {
  function importImageByName(allImages, imageName) {
    const friendlyName = imageName.replace('./', '');
    return { ...allImages, [friendlyName]: r(imageName) };
  }
  return r.keys().reduce(importImageByName, {});
}

// TODO 159: move to constants file, ALL_CAPS
export const images = importAll(requireContext('../assets/images', false, /\.(png|jpe?g|svg)$/));

/**
 * Get a query parameter out of the window's URL
 * @param {*} variable The key to parse
 */
// TODO 199: Can this just use URLSearchParams?
export function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) === variable) return decodeURIComponent(pair[1]);
  }
}

/**
 * Gets the getProlificId from the query string
 */
export function getProlificId() {
  return getQueryVariable('PROLIFIC_PID');
}

/**
 * Emits an audible beep
 * @param {*} audioCodes The type/frequency of the beep
 */
export function beep(audioCodes) {
  const context = new AudioContext();
  const o = context.createOscillator();
  const g = context.createGain();
  o.type = audioCodes.type;
  o.connect(g);
  o.frequency.setValueAtTime(audioCodes.frequency, 0);
  console.log(context.currentTime);
  g.connect(context.destination);
  o.start();
  o.stop(context.currentTime + 0.4);
}