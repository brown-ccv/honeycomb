import _ from 'lodash'
import { triggerPort, eventCodes, keys } from '../config/main'
import { choices } from '../lib/markup/choices'
import { fixationHTML } from '../lib/markup/fixation'
import { photodiodeGhostBox, pdSpotEncode } from '../lib/markup/photodiode'
import { buttonClick, addData, drawOneBead } from '../lib/beadsUtils'
import { jsPsych } from 'jspsych-react'
import $ from 'jquery'


const action = (blockSettings, blockDetails, trialDetails) => {
    let stimulus = `<div style='margin-bottom: -200px'>${fixationHTML}</div>
                    ${photodiodeGhostBox()}`


    return {
        type: 'call_function',
        async: true,
        func: (done) => {
            // send trigger events
            const showCode = eventCodes.show_buttons
            const betCode = eventCodes.bet
            const drawCode = eventCodes.draw

            pdSpotEncode(showCode)

            // add stimulus to the DOM
            document.getElementById('jspsych-content').innerHTML = stimulus + choices(blockSettings)

            // initialize variables
            let buffer = []
            let lastKeyTime = Date.now()
            let key

            const handleEventListener = (event) => {
                // get event key and record time
                key = event.keyCode
                const currentTime = Date.now()

                // if time between two keys is higher than 100 ms, reset the buffer
                if ((currentTime - lastKeyTime) > 100) {
                    buffer = []
                }
                // otherwise add the key pressed to buffer and record time as lastKeyTime
                buffer.push(key)
                lastKeyTime = currentTime


                // if buffer contains the keys A and C draw a bead, set didDraw to true
                // in order to continue te loop (see beadsTrial.js line 44)
                // call buttonClick and addData with draw = true
                if ((buffer.includes(keys.A) &&
                buffer.includes(keys.C)) ||
                buffer.includes(keys.space)) {
                    // data.addToLast({didDraw: true})
                    pdSpotEncode(drawCode)
                    buttonClick(key,
                      trialDetails,
                      blockSettings,
                      blockDetails,
                      true)
                    // and unbind the event listener to stop recording keys
                    $(document).unbind('keydown', handleEventListener)
                    // finish trial
                    done(addData(key,
                            trialDetails,
                            blockDetails,
                            blockSettings,
                            drawCode,
                            true))
                }

                // if buffer contains the keys F or K bet on a color, set didDraw to false
                // call buttonClick and addData with draw = false
                if (((buffer.includes(keys.J) || buffer.includes(keys.F)))) {
                    pdSpotEncode(betCode)
                    buttonClick(key,
                      trialDetails,
                      blockSettings,
                      blockDetails,
                      false)
                    // and unbind the event listener to stop recording keys
                    $(document).unbind('keydown', handleEventListener)
                    // finish trial
                    done(addData(key,
                            trialDetails,
                            blockDetails,
                            blockSettings,
                            betCode,
                            false))
                }
            }
            // Bind event listener to document
            $(document).bind('keydown', handleEventListener)
          }
        }
}

export default action
