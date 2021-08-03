import taskTrial from './taskTrial'
import { generateStartingOpts } from '../lib/taskUtils'

const taskBlock = (blockSettings) => {
  // initialize block
	const startingOpts = generateStartingOpts(blockSettings)

	// timeline = loop through trials
	let timeline = startingOpts.map( (word) => taskTrial(blockSettings, word))

	let blockStart = {
		type: 'html_keyboard_response',
		stimulus: '',
		trial_duration: 1,
		on_finish: (data) => data.block_settings = blockSettings
	}

	timeline.unshift(blockStart)

  return {
		timeline: timeline
	}
}

export default taskBlock
