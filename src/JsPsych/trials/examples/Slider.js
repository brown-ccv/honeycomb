import htmlSliderResponse from '@jspsych/plugin-html-slider-response';

/**
 * Builds a trial with a onscreen message and allows the subject to respond by dragging a slider.
 * @param {string} message - The string to be displayed, this can be formatted as an HTML string. (default: empty string)
 */
export function createSliderTrial(message = '') {
  return {
    type: htmlSliderResponse,
    require_movement: true,
    stimulus: message,
    on_finish: (data) => {
      data.prompt = [message];
      data.answer = [data.response];
    },
  };
}

export const Slider = createSliderTrial();
