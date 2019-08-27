// utilities specific to this app/task

import _ from 'lodash'

// initialize starting conditions for each trial within a block
const generateStartingOpts = (blockSettings) => {
	let startingOptions = blockSettings.conditions.map( (c) => {
		// Repeat each starting condition the same number of times
		return _.range(blockSettings.repeats_per_condition).map( () => c )
	})

	return _.shuffle(_.flatten(startingOptions))
}


export {
	generateStartingOpts
}
