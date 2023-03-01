import { showMessage } from "@brown-ccv/behavioral-task-trials";

import { lang, envConfig } from "../config/main"

import holdUpMarker from "../trials/holdUpMarker";
import startCode from "../trials/startCode";

// TODO: Preamble should just be introductory information - not specific to taskBlock

/**
 * Introductory block for a given task block
 * @param experimentConfig The experiment config.
 * @returns {any} A jsPsych trial object, with a timeline containing the intro and instructions.
 */
const preamble = (experimentConfig) => {
  // Stroop: Create a list of font colors and their corresponding keyboard input.
  const colors = experimentConfig.conditions
  let colorList = ""
  // TODO: colors is set up incorrectly?
  for (let i = 0; i < colors.length; i++) {
    colorList +=
      // First set the font color to the current color.
      // Then select the first letter of the color word and put it in upper case.
      `<li class="font-size-large">
        <span style="color: ${colors[i]}">WORD</span>: ${colors[i][0].toUpperCase()}
       </li>`
  }

  // Text for the instructions
  // TODO: Move this text to the language file
  const instructions =
  `In this game you will be shown words for various colors, for example "BLUE", "RED", or "YELLOW". 
   The letters will be highlighted in one of the colors as well, for instance <span class="red-font">BLUE</span> or 
   <span class="blue-font">BLUE</span>.<br><br>Your job will be to press the button corresponding to the font color 
   <u><strong>as quickly as possible</strong></u>. The colors and corresponding keys are as follows:<br><br>
   <ul class="width-max-content margin-centered">
      ${colorList}
   </ul>`


  const timeline = [
    // Show task name and wait for button response
    showMessage(envConfig, {
      responseType: "html_button_response",
      message: lang.task.name,
      responseEndsTrial: true,
      buttons: [lang.prompt.continue.button],
    }),
      // Show introduction and wait for button response
    showMessage(envConfig, {
      responseType: "html_button_response",
      message: lang.instructions.introduction,
      responseEndsTrial: true,
    }),
    // Show instructions and wait for button response
    showMessage(envConfig, {
      responseType: "html_button_response",
      message: instructions,
      responseEndsTrial: true,
    }),
  ]
  
  if (envConfig.USE_PHOTODIODE) {
    // Add photodiode specific instructions to the preamble.
    timeline.push(holdUpMarker())
    timeline.push(startCode())
  }

  // Return preamble block
  return {
    type: "html_keyboard_response",
    stimulus: "",
    timeline: timeline
  };
}

export default preamble;