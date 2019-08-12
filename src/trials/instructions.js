import { lang } from '../config/main'
import { baseStimulus } from '../lib/markup/stimuli'
import { fixationHTML } from '../lib/markup/fixation'
import { images } from '../lib/utils'
import { beadsHtml } from '../lib/markup/beads'
import { btnGroup } from '../lib/markup/choices'
import _ from 'lodash'

const jar = _.filter(images, (o) => o.includes(`jar`))

const screenOne = () => {
  var stimulus = baseStimulus(`
    <div class='instructions'>
    <h1>${lang.instructions.welcome}</h1>
    <p>${lang.instructions.p1}</p>
    <p>${lang.instructions.p2}</p>
    <div><img class="jar" src="${jar}"/></div>
    </div>
    `, prompt=true)

  return {
    type: 'html_keyboard_response',
    stimulus: stimulus,
    prompt:  lang.prompt.continue.press,
    response_ends_trial: true
  }
}

const screenTwo = () => {
  var stimulus = baseStimulus(`
    <div class='instructions'>
    <p>${lang.instructions.fixation}</p>
    <div id="fixation-dot"></div>
    </div>
    `, prompt=true)

  return {
    type: 'html_keyboard_response',
    stimulus: stimulus,
    prompt:  lang.prompt.continue.press,
    response_ends_trial: true
  }
}

const image1 = _.filter(images, (o) => o.includes(`blue_payout_correct_100`))
const image2 = _.filter(images, (o) => o.includes(`orange_payout_correct_20`))

const screenThree = () => {
  var stimulus = baseStimulus(`
    <div class='instructions'>
    <p>${lang.instructions.money}</p>
    <div class="row">
    <div class="money_bag"><img src="${image1}"/></div>
    <div class="money_bag"><img src="${image2}"/></div>
    </div>
    </div>
    `, prompt=true)
  return {
    type: 'html_keyboard_response',
    stimulus: stimulus,
    prompt:  lang.prompt.continue.press,
    response_ends_trial: true
  }
}

const screenFour = () => {
  var stimulus = baseStimulus(`
    <div class='instructions'>
    <p>${lang.instructions.money2}</p>
    <div class="row">
    <div class="money_bag"><img src="${image1}"/></div>
    <div class="money_bag"><img src="${image2}"/></div>
    </div>
    </div>
    `, prompt=true)
  return {
    type: 'html_keyboard_response',
    stimulus: stimulus,
    prompt:  lang.prompt.continue.press,
    response_ends_trial: true
  }
}


const screenFive = () => {
  var stimulus = baseStimulus(`
    <div class='instructions'>
    <ul>
    <p>${lang.instructions.wrongBet}</p>
    </ul>
    </div>
    `, prompt=true)
  return {
    type: 'html_keyboard_response',
    stimulus: stimulus,
    prompt:  lang.prompt.continue.press,
    response_ends_trial: true
  }
}


const screenSix = () => {
  var stimulus = baseStimulus(`
    <div class='instructions'>
    <p>${lang.instructions.draw}</p>
    <div class="row">
    <img class="jar" src="${jar}"/>
    </div>
    </div>
    `, prompt=true)
  return {
    type: 'html_keyboard_response',
    stimulus: stimulus,
    prompt:  lang.prompt.continue.press,
    response_ends_trial: true
  }
}



const screenSeven = () => {
  var stimulus = baseStimulus(`
    <div class='instructions'>
    <p>${lang.instructions.showBeads}</p>
    <div class='beads'>
      <span class='left'>${beadsHtml('orange', 5, 6)}</span>
      <span class='right'>${beadsHtml('blue', 3, 6)}</span>
    </div>
    </div>
    `, prompt=true)
  return {
    type: 'html_keyboard_response',
    stimulus: stimulus,
    prompt:  lang.prompt.continue.press,
    response_ends_trial: true
  }
}


const screenEight = () => {
  var stimulus = baseStimulus(`
    <div class='instructions'>
    <p>${lang.instructions.buttons}</p>
    ${btnGroup()}
    </div>
    `, prompt=true)
  return {
    type: 'html_keyboard_response',
    stimulus: stimulus,
    prompt:  lang.prompt.continue.press,
    response_ends_trial: true
  }
}

const screenNine = () => {
  var stimulus = baseStimulus(`
    <div class='instructions'>
    <p>${lang.instructions.earnings}</p>
    <div class='earnings'>
    <h1 class='text-success left'>$70</h1>
    <h1 class='text-danger'>-$10</h1>
    </div>
    </div>
    `, prompt=true)
  return {
    type: 'html_keyboard_response',
    stimulus: stimulus,
    prompt:  lang.prompt.continue.press,
    response_ends_trial: true
  }
}

const instructions = {
  type: 'html_keyboard_response',
  timeline: [
    screenOne(),
    screenTwo(),
    screenThree(),
    screenFour(),
    screenFive(),
    screenSix(),
    screenSeven(),
    screenEight(),
    screenNine()
  ]
}

export default instructions
