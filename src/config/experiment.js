import { defaultBlockSettings } from './main';
import { deepCopy } from '../lib/utils';

// FIRST EXPERIMENT BLOCK SETTINGS

// create copy of default settings
export const exptBlock1 = deepCopy({
  ...defaultBlockSettings,
  repeats_per_condition: 2,
});

// SECOND EXPERIMENT BLOCK SETTINGS

// create copy of default settings
export const exptBlock2 = deepCopy({
  ...defaultBlockSettings,
  conditions: ['e', 'f'],
  repeats_per_condition: 2,
});
