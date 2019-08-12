import experimentStart from '../trials/experimentStart'
import zoom from '../trials/zoom'
import welcome from '../trials/welcome'

const preamble = {
  type: 'html_keyboard_response',
  stimulus: '',
  timeline: [experimentStart(), zoom(), welcome]
}

export default preamble
