import React, { useEffect, useState, useRef, useMemo } from "react";
import { initJsPsych } from 'jspsych'

// TODO: jsPsychOptions
import { jsPsychOptions, buildTimeline } from "../timelines/main";

/**
 * A React component that initializes the jsPsych experiment with the Experiment component. This component is rendered
 * when the participant successfully logs in.
 * @param participantID The participant ID.
 * @param studyID The study ID.
 * @param startDate The time in which the experiment started
 * @param taskVersion The version of the task being run
 * @param dataUpdateFunction The function to run after very trial.
 * @param dataFinishFunction The function to run when the experiment finishes.
 * @param width The width of the experiment div
 * @param height The height of the experiment div
 * @returns {JSX.Element} The jsPsych experiment.
 */
function JsPsychExperiment({
  participantId,
  studyId,
  startDate,
  taskVersion,
  dataUpdateFunction,
  dataFinishFunction,
  height = "100%",
  width = "100%"
}) {
  // TODO: Create the startDate function here - this is only displayed after logging in
  // TODO: Can also check the taskVersion from here?

  // Build our jspsych experiment timeline (in this case a Honeycomb demo, you could substitute your own here).
  const [timeline, setTimeline] = useState()
  const [error, setError] = useState()

  // This will be the div in the dom that holds the experiment.
  // We reference it explicitly here so we can do some plumbing with react, jspsych, and events.
  const experimentDivId = 'experimentWindow';
  const experimentDiv = useRef(null);

  // Combine custom options imported from timelines/main.js, with necessary Honeycomb options.
  // TODO: These options are different on a trial by trial basis - should it be an array?
  const combinedOptions = {
    ...jsPsychOptions,
    display_element: experimentDivId,
    on_data_update: (data) => dataUpdateFunction(data),
    on_finish: (data) => dataFinishFunction(data),
  };

  // Create the instance of jsPsych that we'll reuse within the scoope of this JsPsychExperiment component.
  // As of jspsych 7, we create our own jspsych instance(s) where needed instead of importing one global instance.
  // The jsPsych instance is rebuilt when props change
  // TODO: Should this be useCallback?
  const jsPsych = useMemo(() => {
    // Initialize jsPsych and add the study/participant properties
    const jsPsych = initJsPsych(combinedOptions)
    jsPsych.data.addProperties({
      participant_id: participantId,
      study_id: studyId,
      start_date: startDate,
      task_version: taskVersion
    })
    return jsPsych
  }, [participantId, studyId, startDate, taskVersion]);

  useEffect(() => {
    // Build the timeline asynchronously
    // TODO: React wants you to write the async function here and call it immediately?
    try {
      Promise.resolve(buildTimeline(jsPsych)).then(tl => setTimeline(tl))
    } catch (e) {
      // There was an error initializing the timeline
      console.error("ERROR", e, error)
      setError(e)
    }
  }, [jsPsych])
  



  // Set up event and lifecycle callbacks to start and stop jspsych.
  // Inspiration from jspsych-react: https://github.com/makebrainwaves/jspsych-react/blob/master/src/index.js
  const handleKeyEvent = (e) => {
    if (e.redispatched) return

    const new_event = new e.constructor(e.type, e);
    new_event.redispatched = true;
    experimentDiv.current.dispatchEvent(new_event);
  };

  // These useEffect callbacks are similar to componentDidMount / componentWillUnmount.
  // If necessary, useLayoutEffect callbacks might be even more similar.
  // Run the jsPsych experiment
  useEffect(() => {
    window.addEventListener("keyup", handleKeyEvent, true);
    window.addEventListener("keydown", handleKeyEvent, true);

    // TODO: Need a better way of handling the promise?
    console.log(timeline)
    if(timeline) jsPsych.run(timeline);

    return () => {
      window.removeEventListener("keyup", handleKeyEvent, true);
      window.removeEventListener("keydown", handleKeyEvent, true);
      try {
        jsPsych.endExperiment("Ended Experiment");
      } catch (e) {
        console.error("Experiment closed before unmount");
        setError(e)
      }
    };
  });

  // TODO: What to do if timeline rejects from the promise? (error)
  return timeline ? (
    <div className="App">
      <div id={experimentDivId} style={{ height, width }} ref={experimentDiv} />
    </div>
  ) : (
    // Display loading page while timeline is building
    <div className="App height-100">
      <div className="centered-h-v">Loading task...</div>
    </div>
  )
}

export default JsPsychExperiment;
