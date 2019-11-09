// Event trigger settings - used in both the react app (renderer) and the electron app (main)
const manufacturer = 'Teensyduino'
const vendorId = '16c0'
const productId = '0487'

const eventCodes = {
	fixation: 1,
	evidence: 5,
	show_earnings: 7,
	test_connect: 32,
	open_task: 18
}

// this is module.exports isntead of just exports as it is also imported into the electron app
module.exports = {
	manufacturer,
	vendorId,
	productId,
	eventCodes
}
