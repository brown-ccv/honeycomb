// TODO #333: Move to "event_marker" config.json

// teensyduino
const vendorID = "16c0";

// Default if process.env.EVENT_MARKER_PRODUCT_ID is not set
const productID = process.env.EVENT_MARKER_PRODUCT_ID || "";

// Default if process.env.EVENT_MARKER_COM_NAME is not set
const comName = process.env.EVENT_MARKER_COM_NAME || "COM3";

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

export { vendorID, productID, comName, eventCodes };
