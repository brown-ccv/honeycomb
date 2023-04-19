import { initJsPsych } from 'jspsych'
import React, { useEffect, useMemo, useRef } from 'react'

import { config } from '../config/main'
import { initParticipant } from '../firebase'
import { buildTimeline, jsPsychOptions } from '../timelines/main'

function JsPsychExperiment ({
  participantID,
  studyID,
  taskVersion,
  dataUpdateFunction,
  dataFinishFunction
}) {
  // This will be the div in the dom that holds the experiment.
  // We reference it explicitly here so we can do some plumbing with react, jspsych, and events.
  const experimentDivID = 'experimentWindow'
  const experimentDivRef = useRef(null)

  // Combine custom options imported from timelines/maine.js, with necessary Honeycomb options.
  const combinedOptions = {
    ...jsPsychOptions,
    display_element: experimentDivID,
    on_data_update: (data) => dataUpdateFunction(data),
    on_finish: (data) => dataFinishFunction(data)
  }

  // Create the instance of jsPsych that we'll reuse within the scope of this JsPsychExperiment component.
  // As of jspsych 7, we create our own jspsych instance(s) where needed instead of importing one global instance.
  const jsPsych = useMemo(() => {
    // Start date of the experiment - used as the UID
    // TODO 169: JsPsych has a built in timestamp function
    const startDate = new Date().toISOString()

    // Write the initial record to Firestore
    if (config.USE_FIREBASE) initParticipant(participantID, studyID, startDate)

    // Initialize experiment with needed data
    const jsPsych = initJsPsych(combinedOptions)
    jsPsych.data.addProperties({
      participant_id: participantID,
      study_id: studyID,
      start_date: startDate,
      task_version: taskVersion
    })
    return jsPsych
  }, [participantID, studyID, taskVersion])

  // Build our jspsych experiment timeline (in this case a Honeycomb demo, you could substitute your own here).
  const timeline = buildTimeline(jsPsych)

  // Set up event and lifecycle callbacks to start and stop jspsych.
  // Inspiration from jspsych-react: https://github.com/makebrainwaves/jspsych-react/blob/master/src/index.js
  const handleKeyEvent = (e) => {
    if (e.redispatched) return

    const newEvent = new e.constructor(e.type, e)
    newEvent.redispatched = true
    experimentDivRef.current.dispatchEvent(newEvent)
  }

  // These useEffect callbacks are similar to componentDidMount / componentWillUnmount.
  // TODO: useLayoutEffect callbacks might be even more similar.
  useEffect(() => {
    window.addEventListener('keyup', handleKeyEvent, true)
    window.addEventListener('keydown', handleKeyEvent, true)
    jsPsych.run(timeline)

    return () => {
      window.removeEventListener('keyup', handleKeyEvent, true)
      window.removeEventListener('keydown', handleKeyEvent, true)
      try {
        jsPsych.endExperiment('Ended Experiment')
      } catch (e) {
        console.error('Experiment closed before unmount')
      }
    }
  })

  // TODO: Root is not taking up 100vh here? The <body> isn't? Are the trials causing that?
  return (
    <div className='Experiment'>
      <div id={experimentDivID} ref={experimentDivRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}

export default JsPsychExperiment
