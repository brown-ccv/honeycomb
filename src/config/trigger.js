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
module.exports = { eventCodes };
