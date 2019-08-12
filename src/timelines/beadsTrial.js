// import utils and settings
import { randomTrue } from '../lib/utils'
import { assignJarColor } from '../lib/beadsUtils'
import { lang, keys } from '../config/main'

// import trials
import fixation from '../trials/fixation'
import beadStart from '../trials/beadStart'
import showBeads from '../trials/showBeads'
import action from '../trials/action'
import beadEnd from '../trials/beadEnd'


const beadsTrial = (blockSettings, blockDetails, startingNums) => {
  // initialize trial details
  let trialDetails = {
    jar_color: assignJarColor(blockSettings.jar_color_fraction, startingNums),
    color_on_left: randomTrue() ? lang.color.orange : lang.color.blue,
    draws: [],
    total_draw_count: 0,
    num_blue_beads: startingNums.num_blue_beads,
    num_orange_beads: startingNums.num_orange_beads,
    prev_num_blue_beads: startingNums.num_blue_beads,
    prev_num_orange_beads: startingNums.num_orange_beads,
    starting_nums: startingNums,
    trial_earnings: 0,
    is_new: true,
    locked_bead: false,
    start_time: Date.now()
  }

  let coreLoop = [
    showBeads(blockSettings, blockDetails, trialDetails, 1000, 500),
    fixation(650),
    action(blockSettings, blockDetails, trialDetails),
    fixation(500),
  ]

  // loop function is if button pressed was a draw button (https://www.jspsych.org/overview/timeline/#looping-timelines)
  let loopNode = {
    timeline: coreLoop,
    type: 'html_keyboard_response',
    loop_function: (data) => {
      return (data.values()[2].value.button_type === "draw") ? true : false
    }
  }

  // timeline
  let timeline = [
    // start the trial
    beadStart(blockSettings, 500),
    fixation(500),
    // keep drawing until bet
    loopNode,
    // end the trial
    beadEnd(trialDetails, 500)
  ]

    return {
  		type: 'html_keyboard_response',
  		timeline: timeline
  	}
}

export default beadsTrial
