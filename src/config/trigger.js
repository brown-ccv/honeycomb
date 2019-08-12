// Event trigger settings
const manufacturer = 'Teensyduino'
const vendorId = '16c0'
const productId = '0487'


const eventCodes = {
	fixation: 1,
	bet: 2,
	draw: 3,
	show_money: 4,
	initial_evidence: 5,
	updated_evidence: 6,
	bead_pop: 7,
	show_buttons: 8,
	show_earnings: 9
}

module.exports = {
	manufacturer,
	vendorId,
	productId,
	eventCodes
}
