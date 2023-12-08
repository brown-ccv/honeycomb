/**
 * Custom codes for specific task events - used to parse the EEG data
 * NOTE - these event codes must match what is in public/config/trigger.js
 */
const eventCodes = {
  fixation: 1, // Fixation trial
  honeycomb: 2, // Main reaction-time trial for the Honeycomb task
  open_task: 18, // Opening task for setting up the experiment
  test_connect: 32, // Initial test connection
};

// Note that this is module.exports so it can be imported into the electron app
module.exports = { eventCodes };
