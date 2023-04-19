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
  return jsPsych.pluginAPI.getKeyboardResponse({
    callback_function: (info) => {
      jsPsych.finishTrial({ key_press: info.key });
    },
    valid_responses: ['ALL_KEYS'],
    persist: false,
  });
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
  return r
    .keys()
    .reduce(
      (allImages, imageName) => ({ ...allImages, [imageName.replace('./', '')]: r(imageName) }),
      {}
    );
}
// TODO: Rename aas IMAGES
export const images = importAll(requireContext('../assets/images', false, /\.(png|jpe?g|svg)$/));

/**
 *
 * @param {*} variable
 */
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
 *
 * @param {*} audioCodes
 */
export function beep(audioCodes) {
  const context = new AudioContext(); // eslint-disable-line no-undef
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
