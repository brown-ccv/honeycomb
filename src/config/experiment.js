import { defaultBlockSettings } from './main';
import { deepCopy } from '../lib/utils'

// FIRST EXPERIMENT BLOCK SETTINGS

// create copy of default settings
let exptBlock1 = deepCopy(defaultBlockSettings)

exptBlock1.repeats_per_condition = 2

// SECOND EXPERIMENT BLOCK SETTINGS

// create copy of default settings
let exptBlock2 = deepCopy(defaultBlockSettings)

exptBlock2.conditions = ["e", "f"]
exptBlock2.repeats_per_condition = 2

export {
  exptBlock1,
  exptBlock2,
}
