// import React, { useState, useEffect, useRef, useMemo } from "react";
import React, { useEffect, useRef, useMemo } from "react";
import { initJsPsych } from 'jspsych'

// import { getConfig } from "../config/experiment"
import { jsPsychOptions, buildTimeline } from "../timelines/main";

/**
 * A React component that initializes the jsPsych experiment with the Experiment component. 
 * This component is rendered when the participant successfully logs in.

 * @param participantID The participant ID.
 * @param studyID The study ID.
 * @param startDate The time in which the experiment started
 * @param taskVersion The version of the task currently in use
 * @param dataUpdateFunction The function to run after very trial.
 * @param dataFinishFunction The function to run when the experiment finishes.
 * @returns {JSX.Element} The jsPsych experiment.
 */
function JsPsychExperiment({
  participantID,
  studyID,
  startDate,
  taskVersion,
  dataUpdateFunction,
  dataFinishFunction,
  // TODO: Add css class for 100% w/h
  height = "100%",
  width = "100%"
}) {
  // TODO: FROM PR 88
  // The experiment config being used.
  // const [sourceConfig, setSourceConfig] = useState({})
  // The experiment timeline.
  // const [timelineState, setTimelineState] = useState([])
  useEffect(() => {
    // Gets the experiment config, constructs the timeline, and updates the state variables.
    // getConfig(participantID, studyID).then((experimentConfig) => {
    //   setTimelineState(buildTimeline(experimentConfig))
    //   setSourceConfig(experimentConfig)
    // })
  }, [participantID, studyID])


  // This will be the div in the dom that holds the experiment.
  // We reference it explicitly here so we can do some plumbing with react, jspsych, and events.
  const experimentDivId = 'experimentWindow';
  const experimentDiv = useRef(null);

  // Combine custom options imported from timelines/maine.js, with necessary Honeycomb options.
  const combinedOptions = {
    ...jsPsychOptions,
    display_element: experimentDivId,
    on_data_update: (data) => dataUpdateFunction(data),
    on_finish: (data) => dataFinishFunction(data),
  };

  // Create the instance of jsPsych that we'll reuse within the scope of this JsPsychExperiment component.
  // As of jspsych 7, we create our own jspsych instance(s) where needed instead of importing one global instance.
  const setUpJsPsych = () => {
    const jsPsych = initJsPsych(combinedOptions)
    jsPsych.data.addProperties({
      participant_id: participantID,
      study_id: studyID,
      start_date: startDate,
      task_version: taskVersion
    })
    return jsPsych
  }
  const jsPsych = useMemo(setUpJsPsych, [participantID, studyID, startDate, taskVersion]);
  console.log("jsPsych", jsPsych)

  // Build our jspsych experiment timeline (in this case a Honeycomb demo, you could substitute your own here).
  // TODO: Use with state variable?
  const timeline = buildTimeline(jsPsych)

  // Set up event and lifecycle callbacks to start and stop jspsych.
  // Inspiration from jspsych-react: https://github.com/makebrainwaves/jspsych-react/blob/master/src/index.js
  const handleKeyEvent = e => {
    if (e.redispatched) return;
    let new_event = new e.constructor(e.type, e);
    new_event.redispatched = true;
    experimentDiv.current.dispatchEvent(new_event);
  };

  // These useEffect callbacks are similar to componentDidMount / componentWillUnmount.
  // If necessary, useLayoutEffect callbacks might be even more similar.
  useEffect(() => {
    window.addEventListener("keyup", handleKeyEvent, true);
    window.addEventListener("keydown", handleKeyEvent, true);
    jsPsych.run(timeline);

    return () => {
      window.removeEventListener("keyup", handleKeyEvent, true);
      window.removeEventListener("keydown", handleKeyEvent, true);
      try {
        jsPsych.endExperiment("Ended Experiment");
      } catch (e) {
        console.error("Experiment closed before unmount");
      }
    };
  });

  // TODO: Conditionally render loading screen in App.jsx?
  console.log("EXPERIMENT", timeline)
  return timeline.length === 0 ?
   (
    // Show loading screen while timeline is being constructed
    <div className="App height-100">
      <div className="centered-h-v">Loading task</div>
    </div>
   ) : (
    // Display experiment
    <div className="App">
      {/* <Experiment
        settings={{
          timeline: timeline,
          on_data_update: (data) => dataUpdateFunction(data),
          on_finish: (data) => {
            data.config = sourceConfig
            dataFinishFunction(data)
          },
        }}
      /> */}
      {/* TODO: Apply style with a className */}
      <div id={experimentDivId} style={{ height, width }} ref={experimentDiv} />
    </div>
   )
}

export default JsPsychExperiment;
