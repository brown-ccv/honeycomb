import { defaultBlockSettings } from './main';
import { deepCopy } from '../lib/utils';

// TUTORIAL SETTINGS

// create copy of default settings
export const tutorialBlock = deepCopy({
  ...defaultBlockSettings,
  is_tutorial: true,
  photodiode_active: false,
});
