import React, { useEffect, useRef, useMemo } from "react";
import { initJsPsych } from 'jspsych'
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response'
//import { tl } from "../timelines/main";

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
  // This will be the div in the dom that holds the experiment.
  // We reference it explicitly here so we can do some plumbing with react, jspsych, and events.
  const experimentDivId = 'experimentWindow';
  const experimentDiv = useRef(null);

  const jsPsychOpts = {
    display_element: experimentDivId,
    on_data_update: (data) => dataUpdateFunction(data),
    on_finish: (data) => dataFinishFunction(data),
  };

  // Create the instance of jsPsych that we'll reuse throughout the experiment.
  // As of jspsych 7, we create instances of jspsych as needed instead of importing globally.
  const setUpJsPsych = () => {
    const jsPsych = initJsPsych(jsPsychOpts)
    jsPsych.data.addProperties({
      participant_id: participantId,
      study_id: studyId,
      start_date: startDate,
      task_version: taskVersion
    })
    return jsPsych
  }
  const jsPsych = useMemo(setUpJsPsych, [participantId, studyId, startDate, taskVersion]);

  // Build our experiment timeline (in this case a Honeycomb demo timeline, you could substitute your own here).
  // const timeline = buildTimeline(jsPsych);
  const timeline = [{
    type: htmlKeyboardResponse,
    stimulus: 'Hello world!',
  }]
  console.log(timeline[0])


  // Set up even and lifecycle callbacks to start and stop jspsych.
  const handleKeyEvent = e => {
    if (e.redispatched) {
      return;
    }
    let new_event = new e.constructor(e.type, e);
    new_event.redispatched = true;
    experimentDiv.current.dispatchEvent(new_event);
  };

  // We might need to use useLayoutEffect instead of useEffect?
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
        console.log("Experiment closed before unmount");
      }
    };
  });


  //const tl = buildTimeline(jsPsych)

  const message = `participantId ${participantId}, studyId ${studyId}, startDate ${startDate}, taskVersion ${taskVersion}`;
  console.log(message)

  return (
    <div className="App">
      Hello from Mars! {message}
      <div id={experimentDivId} style={{ height, width }} ref={experimentDiv} />
    </div>
  );
}

export default JsPsychExperiment;
