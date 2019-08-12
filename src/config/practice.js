import { defaultBlockSettings } from './main';
import { deepCopy } from '../lib/utils'

// PRACTICE BLOCK SETTINGS

// create copy of default settings
let practiceBlock = deepCopy(defaultBlockSettings)

practiceBlock.conditions = ["m", "n"]
practiceBlock.repeats_per_condition = 1

practiceBlock.is_practice = true

// export the settings
export {
	practiceBlock
}
