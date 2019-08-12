import { oppositeColor } from '../utils'
import { lang } from '../../config/main'

const betButtonHtml = (position, blockSettings) => {
  const colorOnLeft = blockSettings.color_on_left
  const color = (position === 'left') ? colorOnLeft : oppositeColor(colorOnLeft)

  return (
    `<button class='jspsych-btn bet-btn bg-${color}'>Mostly ${color}</button>`
  )
}

const drawbuttonHtml = `<button class="jspsych-btn draw-btn bg-black">${lang.beadMarkup.choices.draw}</button>`

const choices = (blockSettings) => (
      `${betButtonHtml('left', blockSettings)}
       ${drawbuttonHtml}
       ${betButtonHtml('right', blockSettings)}`
)

const btnGroup = () => (
   `<div id="jspsych-html-button-response-btngroup">
    <div class="jspsych-html-button-response-button" style="display: inline-block; margin:0px 8px" id="jspsych-html-button-response-button-0" data-choice="0">
    <button class="jspsych-btn bet-btn bg-blue">${lang.beadMarkup.choices.mostly} ${lang.color.blue}</button>
    </div>
    <div class="jspsych-html-button-response-button" style="display: inline-block; margin:0px 8px" id="jspsych-html-button-response-button-1" data-choice="1">
    <button class="jspsych-btn draw-btn bg-black">${lang.beadMarkup.choices.draw}</button>
    </div>
    <div class="jspsych-html-button-response-button" style="display: inline-block; margin:0px 8px" id="jspsych-html-button-response-button-2" data-choice="2">
    <button class="jspsych-btn bet-btn bg-orange">${lang.beadMarkup.choices.mostly} ${lang.color.orange}</button>
    </div>
    </div>`
  )

export {
  choices,
  btnGroup
}
