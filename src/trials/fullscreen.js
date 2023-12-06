import jsPsychFullscreen from "@jspsych/plugin-fullscreen";

/**
 * Trial to enter fullscreen mode.
 * Any trials after this one will be run while the app/browser is in fullscreen.
 */
export const enterFullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: true,
};

/**
 * Trial to exit fullscreen mode.
 * Any trials after this one will NOT be run while the app/browser is in fullscreen.
 */
export const exitFullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
};
