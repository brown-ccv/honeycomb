import requireContext from 'require-context.macro';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// add a random number between 0 and offset to the base number
function jitter(base, offset) {
  return base + Math.floor(Math.random() * Math.floor(offset));
}

// add a random number between 0 and 50 to the base number
function jitter50(base) {
  return jitter(base, 50);
}

// flip a coin
function randomTrue() {
  return Math.random() > 0.5;
}

// deeply copy an object
function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// format a number as a dollar amount
function formatDollars(amount) {
  return '$' + parseFloat(amount).toFixed(2);
}

// create a pre-trial wait period
function generateWaitSet(trial, waitTime) {
  const waitTrial = Object.assign({}, trial);
  waitTrial.trial_duration = waitTime;
  waitTrial.response_ends_trial = false;
  waitTrial.prompt = '-';

  return [waitTrial, trial];
}

// As of jspsych 7, we instantiate jsPsych where needed insead of importing it globally.
// The jsPsych instance passed in here should be the same one used for the running task.
function startKeypressListener(jsPsych) {
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

// Discover and import images in src/assets/images.
// This produces an object that maps friendly image file names to obscure webpack path names.
// For example:
//   {
//     image1.png: '/static/media/image1.5dca7a2a50fb8b633fd5.png',
//     image2.png: '/static/media/image2.5dca7a2a50fb8b633fd5.png'
//   }
function importAll(r) {
  function importImageByName(allImages, imageName) {
    const friendlyName = imageName.replace('./', '');
    return { ...allImages, [friendlyName]: r(imageName) };
  }
  return r.keys().reduce(importImageByName, {});
}
// TODO: move to constants file
const images = importAll(requireContext('../assets/images', false, /\.(png|jpe?g|svg)$/));

function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) === variable) return decodeURIComponent(pair[1]);
  }
}

function getProlificId() {
  return getQueryVariable('PROLIFIC_PID');
}

function beep(audioCodes) {
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
  beep,
};
