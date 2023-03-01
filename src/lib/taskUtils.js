import _ from 'lodash'

// TODO: Add comments for these functions
/**
 * Utility functions specific to the experiment
*/

// initialize starting conditions for each trial within a block

/**
 * Given the experiment config, returns a randomized array of the conditions provided,
 * Each one is repeated the same number of times.
 * @param experimentConfig The experiment config object.
 * @returns {array} A randomized array of conditions.
 */
const generateStartingOpts = (experimentConfig) => {
	let startingOptions = experimentConfig.conditions.map((c) => {
		return _.range(experimentConfig.repeats_per_condition).map(() => c)
	})
	return _.shuffle(_.flatten(startingOptions))
}

export { generateStartingOpts }
