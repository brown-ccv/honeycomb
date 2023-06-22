import packageJson from '../../package.json';

export const TASK_NAME = packageJson.name;
export const TASK_VERSION = packageJson.version;

// Mapping of useful letters to their keyboard codes
export const KEYS = {
  A: 65,
  B: 66,
  C: 67,
  F: 70,
  J: 74,
  space: 32,
};

// NOTE - these event codes must match what is in public/config/trigger.js
// TODO: How to use public/ file in electron and browser? (Absolute imports point to public I think?)

export const EVENT_CODES = {
  fixation: 1,
  evidence: 5,
  show_earnings: 7,
  test_connect: 32,
  open_task: 18,
};

// Audio code settings
export const AUDIO_CODES = {
  frequency: 100 * 9,
  type: 'sine',
};