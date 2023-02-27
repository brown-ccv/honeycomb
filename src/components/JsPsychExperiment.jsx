import React, { useState, useEffect } from "react";
import { Experiment } from "jspsych-react"

import buildPrimaryTimeline from "../timelines/main"
import { getConfig } from "../config/experiment"

/**
 * A React component that initializes the jsPsych experiment with the Experiment component. 
 * This component is rendered when the participant successfully logs in.

 * @param participantID The participant ID.
 * @param studyID The study ID.
 * @param dataUpdateFunction The function to run after very trial.
 * @param dataFinishFunction The function to run when the experiment finishes.
 * @returns {JSX.Element} The jsPsych experiment.
 */
function JsPsychExperiment({
  participantID,
  studyID,
  // startDate,
  // taskVersion,
  dataUpdateFunction,
  dataFinishFunction,
}) {
  // The experiment config being used.
  const [sourceConfig, setSourceConfig] = useState({})
  // The experiment timeline.
  const [timeline, setTimeline] = useState([])

  useEffect(() => {
    // Gets the experiment config, constructs the timeline, and updates the state variables.
    getConfig(participantID, studyID).then((experimentConfig) => {
      setTimeline(buildPrimaryTimeline(experimentConfig))
      setSourceConfig(experimentConfig)
    })
  }, [participantID, studyID])


  // This will be the div in the dom that holds the experiment.
  // We reference it explicitly here so we can do some plumbing with react, jspsych, and events.
  // TODO: PR #88 doesn't include this, is it necessary?
  // const experimentDivId = 'experimentWindow';
  // const experimentDiv = useRef(null);

  // Combine custom options imported from timelines/maine.js, with necessary Honeycomb options.
  // TODO: PR #88 doesn't include this, is it necessary?
  // const combinedOptions = {
  //   ...jsPsychOptions,
  //   display_element: experimentDivId,
  //   on_data_update: (data) => dataUpdateFunction(data),
  //   on_finish: (data) => dataFinishFunction(data),
  // };

  // Create the instance of jsPsych that we'll reuse within the scoope of this JsPsychExperiment component.
  // As of jspsych 7, we create our own jspsych instance(s) where needed instead of importing one global instance.
  // TODO: PR #88 doesn't include this, is it necessary?
  // const setUpJsPsych = () => {
  //   const jsPsych = initJsPsych(combinedOptions)
  //   jsPsych.data.addProperties({
  //     participant_id: participantId,
  //     study_id: studyId,
  //     start_date: startDate,
  //     task_version: taskVersion
  //   })
  //   return jsPsych
  // }
  // const jsPsych = useMemo(setUpJsPsych, [participantID, studyID, startDate, taskVersion]);

  // Build our jspsych experiment timeline (in this case a Honeycomb demo, you could substitute your own here).
  // const timeline = buildTimeline(jsPsych)

  // Set up event and lifecycle callbacks to start and stop jspsych.
  // Inspiration from jspsych-react: https://github.com/makebrainwaves/jspsych-react/blob/master/src/index.js
  // TODO: PR #88 doesn't include this, is it necessary?
  // const handleKeyEvent = e => {
  //   if (e.redispatched) {
  //     return;
  //   }
  //   let new_event = new e.constructor(e.type, e);
  //   new_event.redispatched = true;
  //   experimentDiv.current.dispatchEvent(new_event);
  // };

  // These useEffect callbacks are similar to componentDidMount / componentWillUnmount.
  // If necessary, useLayoutEffect callbacks might be even more similar.
  // TODO: PR #88 doesn't include this, is it necessary?
  // useEffect(() => {
  //   window.addEventListener("keyup", handleKeyEvent, true);
  //   window.addEventListener("keydown", handleKeyEvent, true);
  //   jsPsych.run(timeline);

  //   return () => {
  //     window.removeEventListener("keyup", handleKeyEvent, true);
  //     window.removeEventListener("keydown", handleKeyEvent, true);
  //     try {
  //       jsPsych.endExperiment("Ended Experiment");
  //     } catch (e) {
  //       console.error("Experiment closed before unmount");
  //     }
  //   };
  // });

  // TODO: Conditionally render loading screen in App.jsx?
  return timeline.length === 0 ?
   (
    // Show loading screen while timeline is being constructed
    <div className="App height-100">
      <div className="centered-h-v">Loading task</div>
    </div>
   ) : (
    // Display experiment
    <div className="App">
      <Experiment
        settings={{
          timeline: timeline,
          on_data_update: (data) => dataUpdateFunction(data),
          on_finish: (data) => {
            data.config = sourceConfig
            dataFinishFunction(data)
          },
        }}
      />
    </div>
   )
}

export default JsPsychExperiment;
