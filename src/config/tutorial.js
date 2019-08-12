import { defaultBlockSettings } from './main';
import { deepCopy } from '../lib/utils'

// TUTORIAL SETTINGS

// create copy of default settings
let tutorialBlock = deepCopy(defaultBlockSettings)

// update default settings for tutorial
tutorialBlock.is_tutorial = true
tutorialBlock.photodiode_active = false

// export the settings
export {
	tutorialBlock
}
