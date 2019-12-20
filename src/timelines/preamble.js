import experimentStart from '../trials/experimentStart'
import startCode from '../trials/startCode'
import userId from '../trials/userId'
import holdUpMarker from '../trials/holdUpMarker'
import { AT_HOME, IS_ELECTRON } from '../config/main'

const preamble = {
  type: 'html_keyboard_response',
  stimulus: '',
  timeline: (AT_HOME || !IS_ELECTRON) ?
    [experimentStart(), userId()] :
    [experimentStart(), userId(), holdUpMarker(), startCode()]
}

export default preamble
