// utilities specific to this app/task

import _ from 'lodash'

/**
 * Given the experiment config, returns a randomized array of the conditions provided, with each one repeated the
 * same number of times.
 * @param experimentConfig The experiment config object.
 * @returns {array} A randomized array of conditions.
 */
const generateStartingOpts = (experimentConfig) => {
	let startingOptions = experimentConfig.conditions.map( (c) => {
		// Repeat each starting condition the same number of times
		return _.range(experimentConfig.repeats_per_condition).map( () => c )
	})

	return _.shuffle(_.flatten(startingOptions))
}

export { generateStartingOpts }
