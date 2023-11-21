// TODO 333: Move to "event_marker" config.json

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
  open_task: 18,
  test_connect: 32,
};

// Note that this is module.exports so it can be imported into the electron app
export { vendorID, productID, comName, eventCodes };
