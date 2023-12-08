// Event trigger settings - used in both the react app (renderer) and the electron app (main)
// teensyduino
const vendorId = "16c0";
const productId = "";

// brainvision - will be used if product Id (line 4) or process.env.EVENT_MARKER_PRODUCT_ID are not set
// commName can be changed with environment variable process.env.EVENT_MARKER_COM_NAME
const comName = "COM3";

// ! These event codes must match what is in public/config/trigger.js
const eventCodes = {
  fixation: 1, // Fixation trial
  honeycomb: 2, // Main reaction-time trial for the Honeycomb task
  open_task: 18, // Opening task for setting up the experiment
  test_connect: 32, // Initial test connection
};

// this is module.exports instead of just exports as it is also imported into the electron app
module.exports = {
  vendorId,
  productId,
  eventCodes,
  comName,
};
