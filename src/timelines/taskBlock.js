import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response'
import taskTrial from './taskTrial'
import { generateStartingOpts } from '../lib/taskUtils'


const taskBlock = (blockSettings) => {
  // initialize block
  const startingOpts = generateStartingOpts(blockSettings)

  const blockDetails = {
    block_earnings: 0.0,
    optimal_earnings: 0.0,
    continue_block: true
  }

  // timeline = loop through trials
  let timeline = startingOpts.map((condition) => taskTrial(blockSettings, blockDetails, condition))

  let blockStart = {
    type: htmlKeyboardResponse,
    stimulus: '',
    trial_duration: 1,
    on_finish: (data) => data.block_settings = blockSettings
  }

  timeline.unshift(blockStart)

  return {
    type: htmlKeyboardResponse,
    timeline: timeline
  }
}

export default taskBlock
