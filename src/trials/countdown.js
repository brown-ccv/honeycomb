import * as _ from 'lodash'

// build a countdown transition with the given text and number of seconds
const buildCountdown = (text, time) => {
  const times = _.range(time, 0 , -1)
  const timeline = times.map( (val) => {return({ prompt: `<h1>${val}</h1>` })})

  return ({
    type: 'html_keyboard_response',
    stimulus: `<h3>${text}</h3`,
    trial_duration: 1000,
    response_ends_trial: false,
    timeline:  timeline
  })
}

export default buildCountdown
