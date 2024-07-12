import jsPsychFullscreen from "@jspsych/plugin-fullscreen";

/**
 * Trial to enter fullscreen mode.
 * Any trials after this one will be run while the app/browser is in fullscreen.
 */
export const enterFullscreenTrial = {
  type: jsPsychFullscreen,
  fullscreen_mode: true,
  on_finish: (data) => {
    // Record some additional information about the user's screen
    data.screen_width = screen.width;
    data.screen_height = screen.height;
    data.screen_pixel_ratio = window.devicePixelRatio;
  },
};

/**
 * Trial to exit fullscreen mode.
 * Any trials after this one will NOT be run while the app/browser is in fullscreen.
 */
export const exitFullscreenTrial = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
};
