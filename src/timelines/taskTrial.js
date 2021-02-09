// import trials
import fixation from '../trials/fixation'
import showCondition from '../trials/showCondition'
import taskEnd from '../trials/taskEnd'


const taskTrial = (blockSettings, blockDetails, condition) => {
  // initialize trial details
  let trialDetails = {
    condition: condition,
    trial_earnings: 0,
    start_time: Date.now()
  }

  // timeline
  let timeline = [
    // fixation
    fixation(650),
    // show condition
    showCondition(condition, 1000, 500),
    // fixation
    fixation(650),
    // end the trial
    taskEnd(trialDetails, 500)
  ]

    return {
  		type: 'html_keyboard_response',
  		timeline: timeline
  	}
}

export default taskTrial
