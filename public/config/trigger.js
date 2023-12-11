/**
 * The vendor identifier of the USB serial device.
 * This value is used for the "teensyduino" trigger box
 */
const vendorId = "16c0";

/**
 * The product identifier of the USB serial device.
 * This value is used for the "teensyduino" trigger box
 * This value can be changed with the environment variable EVENT_MARKER_PRODUCT_ID
 */
const productId = ""; // TODO: This is not set? Should it be undefined?

/**
 * The COM name of the USB serial device
 * This value is used if productId or EVENT_MARKER_PRODUCT_ID are not set
 * This value can be changed with the environment variable EVENT_MARKER_COM_NAME
 */
const comName = "COM3";

/**
 * Custom codes for specific task events - used to parse the EEG data
 * ! These event codes must match what is in public/config/trigger.js
 */
// TODO #354: Each event should have a code, name, and numBlinks
const eventCodes = {
  fixation: 1, // Fixation trial
  honeycomb: 2, // Main reaction-time trial for the Honeycomb task
  open_task: 18, // Opening task for setting up the experiment
  test_connect: 32, // Initial test connection
};

// module.exports is used so it can be imported into the electron app
module.exports = {
  vendorId,
  productId,
  eventCodes,
  comName,
};
