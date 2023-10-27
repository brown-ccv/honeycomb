// teensyduino
const vendorID = "16c0";

// Default if process.env.EVENT_MARKER_PRODUCT_ID is not set
const productID = process.env.EVENT_MARKER_PRODUCT_ID || "";

// Default if process.env.EVENT_MARKER_COM_NAME is not set
const comName = process.env.EVENT_MARKER_COM_NAME || "COM3";

/**
 * Custom codes for specific task events - used to parse the EEG data
 * NOTE - these event codes must match what is in public/config/trigger.js
 */
const eventCodes = {
  fixation: 1,
  evidence: 5,
  show_earnings: 7,
  test_connect: 32,
  open_task: 18,
};

// Note that this is module.exports so it can be imported into the electron app
// module.exports = { eventCodes };
export { vendorID, productID, comName, eventCodes };
// TODO: Rename file? This is specific to EEG stuff?
// TODO: Should this just be json?
