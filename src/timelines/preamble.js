import experimentStart from '../trials/experimentStart'
import startCode from '../trials/startCode'
import userId from '../trials/userId'
import holdUpMarker from '../trials/holdUpMarker'
import { AT_HOME, IS_ELECTRON } from '../config/main'

console.log('at_home', AT_HOME)
console.log('env at home', process.env.REACT_APP_AT_HOME)
const preamble = {
  type: 'html_keyboard_response',
  stimulus: '',
  timeline: (AT_HOME || !IS_ELECTRON) ?
    [experimentStart(), userId()] :
    [experimentStart(), userId(), holdUpMarker(), startCode()]
}

export default preamble
