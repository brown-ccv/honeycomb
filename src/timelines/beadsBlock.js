import { generateStartingOpts } from '../lib/beadsUtils'
import beadsTrial from './beadsTrial'
// import blockEnd from '../trials/blockEnd'




const beadsBlock = (blockSettings) => {
  // initialize block
	const startingOpts = generateStartingOpts(blockSettings)

  const blockDetails = {
	  block_earnings: 0.0,
		optimal_earnings: 0.0,
		continue_block: true
	}

	// timeline = loop through trials, then blockEnd
	let timeline = startingOpts.map( (startingNums) => beadsTrial(blockSettings, blockDetails, startingNums))

	// timeline.push(blockEnd(blockDetails))

  return {
		type: 'html_keyboard_response',
		timeline: timeline
	}
}

export default beadsBlock
