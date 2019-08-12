import _ from 'lodash'
import { lang, eventCodes, keys } from '../config/main'
import { shuffleArray, oppositeColor } from './utils'
import { pdSpotEncode } from './markup/photodiode'
import $ from 'jquery'

const probabilityOfOrange = (ratio, countBlue, countOrange) => {
	let likelihoodBlue = Math.pow(ratio, countBlue) * Math.pow((1-ratio), countOrange)
	let likelihoodOrange = Math.pow(ratio, countBlue) * Math.pow((1-ratio), countOrange)
	let likelihoodAll = likelihoodOrange + likelihoodBlue

	return likelihoodOrange / likelihoodAll
}

const assignJarColor = (jarColorFraction, startingNums) => {
	const jarColor = ( Math.random() <
			probabilityOfOrange(
				jarColorFraction,
				startingNums.num_blue_beads.current,
				startingNums.num_orange_beads.current)
			) ? lang.color.orange
			  : lang.color.blue

	return jarColor
}

const buttonClick = (key, trialDetails, blockSettings, blockDetails, draw = false) => {
	if (draw) {
		drawOneBead(blockSettings, trialDetails, blockDetails)
	}
	else {
		updateEarnings(key, blockSettings, blockDetails, trialDetails)
	}
}

const colorKey = (buttonPressed, blockSettings) => {
	const leftKey = keys.F
	const colorChosen = (buttonPressed === leftKey)
				? blockSettings.color_on_left
				: oppositeColor(blockSettings.color_on_left)
	return colorChosen
}

const isBetCorrect = (buttonPressed, blockSettings, trialDetails) => {
	const correct = trialDetails.jar_color
	const colorChosen = colorKey(buttonPressed, blockSettings)
	const isCorrect = (correct === colorChosen) ? true : false

	return isCorrect
}

const updateEarnings = (buttonPressed, blockSettings, blockDetails, trialDetails) => {
	const colorChosen = colorKey(buttonPressed, blockSettings)

	const betEarning = (isBetCorrect(buttonPressed, blockSettings, trialDetails))
			? blockSettings.bead_settings[colorChosen].correct
			: blockSettings.bead_settings[colorChosen].wrong


	trialDetails.trial_earnings += betEarning
	blockDetails.block_earnings += betEarning
}


/* Randomly samples a bead from the current jar and updates trial_details according to
bead drawn */
const drawOneBead = (blockSettings, trialDetails, blockDetails) => {
	const rand = Math.random()
	const drawn = (rand >= blockSettings.jar_color_fraction)
		? oppositeColor(trialDetails.jar_color)
		: trialDetails.jar_color
	console.log(rand, drawn, Date.now())

	trialDetails.prev_num_orange_beads = trialDetails.num_orange_beads
	trialDetails.prev_num_blue_beads = trialDetails.num_blue_beads

	// Updating trial_details
	if (drawn === lang.color.orange) {
		trialDetails.num_orange_beads += 1
	}
	else {
    trialDetails.num_blue_beads += 1
	}

  trialDetails.trial_earnings += blockSettings.draw_cost // draw_cost should be negative
  trialDetails.draws.push([drawn, Date.now()])
  trialDetails.total_draw_count += 1
  blockDetails.block_earnings += blockSettings.draw_cost // draw_cost should be negative
}

// get bead code to send to port
const sendBeadCode = (blockSettings, trialDetails) => {
	const prevBlue = trialDetails.prev_num_blue_beads
	const prevOrange = trialDetails.prev_num_orange_beads
	const blue = trialDetails.num_blue_beads
	const orange = trialDetails.num_orange_beads
	let pop = false

	if ((blue === prevBlue) && (orange === prevOrange)) {
		pdSpotEncode(eventCodes.initial_evidence)
	}
	else {
		pdSpotEncode(eventCodes.updated_evidence)
		pop = true
	}
	return pop
}


// checks previous and current trial data to find out wich side to add a bead
const getTagId = (blockSettings, trialDetails) => {
	const prevBlue = trialDetails.prev_num_blue_beads
	const prevOrange = trialDetails.prev_num_orange_beads
	const blue = trialDetails.num_blue_beads
	const orange = trialDetails.num_orange_beads
	const left = blockSettings.color_on_left
	let tagId

	if ( blue > prevBlue ) {
		tagId = ( left === lang.color.blue ) ? '#left_beads' : '#right_beads'
	}

	if ( orange > prevOrange ) {
		tagId = ( left === lang.color.orange ) ? '#left_beads' : '#right_beads'
	}

	return tagId
}

// append bead to bead container
const appendBead = (tagId) => {
	const oneBead = $(`${tagId} .fa-circle`).first().prop('outerHTML')
	$(oneBead).appendTo(tagId)
}

// save data
const addData = (key, trialDetails, blockDetails, blockSettings, triggerCode, isDraw=false) => {
	return {
		patient_id: blockSettings.patiendId,
		timestamp: Date.now(),
		correct_response: (isDraw) ? null : isBetCorrect(key, blockSettings, trialDetails),
		button_type: (isDraw) ? 'draw' : 'bet',
		earnings_trial: trialDetails.trial_earnings,
		earnings_block: blockDetails.block_earnings,
		oranges: trialDetails.num_orange_beads,
		blues: trialDetails.num_blue_beads,
		color: (isDraw) ? trialDetails.draws[0][0] : colorKey(key, blockSettings),
		code: triggerCode
	}
}

// initialize starting conditions for each trial within a block
const generateStartingOpts = (blockSettings) => {
	let startingOptions = blockSettings.starting_diffs.map( (diff) => {
		let numOrange = Math.round((blockSettings.num_starting_beads + diff) / 2)
		let numBlue = numOrange - diff
		let nums = {
			num_blue_beads: numBlue,
			num_orange_beads: numOrange
		}
		// Repeat each starting condition the same number of times
		return _.range(blockSettings.repeats_per_condition).map( () => nums )
	})

	return shuffleArray(_.flatten(startingOptions))
}


export {
	generateStartingOpts,
	assignJarColor,
	buttonClick,
	getTagId,
	appendBead,
	sendBeadCode,
	addData,
	drawOneBead
}
