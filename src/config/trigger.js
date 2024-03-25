// TODO @brown-ccv #333: Nest this data under "trigger_box" equipment in config.json

// teensyduino
export const vendorID = "16c0";

// Default if process.env.EVENT_MARKER_PRODUCT_ID is not set
export const productID = process.env.EVENT_MARKER_PRODUCT_ID || "";

// Default if process.env.EVENT_MARKER_COM_NAME is not set
export const comName = process.env.EVENT_MARKER_COM_NAME || "COM3";

/** Custom codes for specific task events - used to identify the trials */
// TODO @brown-ccv #354: Each event should have a code, name, and numBlinks
export const eventCodes = {
  fixation: 1, // Fixation trial
  honeycomb: 2, // Main reaction-time trial for the Honeycomb task
  open_task: 18, // Opening task for setting up the experiment
  test_connect: 32, // Initial test connection
};
