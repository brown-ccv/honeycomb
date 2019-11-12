// NOTE - these event codes must match what is in public/config/trigger.js
const eventCodes = {
	fixation: 1,
	evidence: 5,
	show_earnings: 7,
	test_connect: 32,
	open_task: 18
}

// this is module.exports isntead of just exports as it is also imported into the electron app
module.exports = {
	eventCodes
}
