import { defaultBlockSettings } from './main';
import { deepCopy } from '../lib/utils';

// PRACTICE BLOCK SETTINGS

// create copy of default settings
export const practiceBlock = deepCopy({
  ...defaultBlockSettings,
  conditions: ['m', 'n'],
  repeats_per_condition: 1,
  is_practice: true,
});
