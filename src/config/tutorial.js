import { defaultBlockSettings } from './main';
import { deepCopy } from '../lib/utils';

// TUTORIAL SETTINGS

// create copy of default settings
// TODO: Function for setting  ' is_tutorial: true,photodiode_active: false,' to a given block
export const tutorialBlock = deepCopy({
  ...defaultBlockSettings,
  is_tutorial: true,
  photodiode_active: false,
});
