import holdUpMarker from "../trials/holdUpMarker"
import startCode from "../trials/startCode"
import { lang, envConfig } from "../config/main"
import { showMessage } from "@brown-ccv/behavioral-task-trials"

/**
 * Shows the introduction and instructions for the task.
 * @param experimentConfig The experiment config.
 * @returns {any} A jsPsych trial object, with a timeline containing the intro and instructions.
 */
const preamble = (experimentConfig) => {
  // Get the colors that should be displayed in the task.
  const colors = experimentConfig.conditions
  let colorList = ""

  // For instructions HTML: Loop through the colors and create a list of font colors and their corresponding
  // keyboard input.
  for (let i = 0; i < colors.length; i++) {
    colorList +=
      // First set the font color to the current color.
      // Then select the first letter of the color word and put it in upper case.
      `<li class="font-size-large">
        <span style="color: ${colors[i]}">WORD</span>: ${colors[i][0].toUpperCase()}
       </li>`
  }

  const instructions =
    `In this game you will be shown words for various colors, for example "BLUE", "RED", or "YELLOW". 
     The letters will be highlighted in one of the colors as well, for instance <span class="red-font">BLUE</span> or 
     <span class="blue-font">BLUE</span>.<br><br>Your job will be to press the button corresponding to the font color 
     <u><strong>as quickly as possible</strong></u>. The colors and corresponding keys are as follows:<br><br>
     <ul class="width-max-content margin-centered">
        ${colorList}
     </ul>`

  let timeline = [
    showMessage(envConfig, {
      responseType: "html_button_response",
      message: lang.task.name,
      responseEndsTrial: true,
      buttons: [lang.prompt.continue.button],
    }),
    showMessage(envConfig, {
      responseType: "html_button_response",
      message: lang.instructions.introduction,
      responseEndsTrial: true,
    }),
    showMessage(envConfig, {
      responseType: "html_button_response",
      message: instructions,
      responseEndsTrial: true,
    }),
  ]

  // If using the photodiode, add these photodiode-specific trials to the preamble.
  if (envConfig.USE_PHOTODIODE) {
    timeline.push(holdUpMarker())
    timeline.push(startCode())
  }

  return {
    type: "html_keyboard_response",
    stimulus: "",
    timeline: timeline
  }
}

export default preamble
