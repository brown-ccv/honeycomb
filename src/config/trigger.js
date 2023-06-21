// NOTE - these event codes must match what is in public/config/trigger.js
// TODO: Import these from public/config/trigger.js

// this is module.exports instead of just exports as it is also imported into the electron app
// TODO: Let electron use ES7 syntax
module.exports = {
  eventCodes: {
    fixation: 1,
    evidence: 5,
    show_earnings: 7,
    test_connect: 32,
    open_task: 18,
  },
};
