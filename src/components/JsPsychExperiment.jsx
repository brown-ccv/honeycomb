import React, { useEffect, useRef, useMemo } from "react";
import { initJsPsych } from 'jspsych'
import { jsPsychOptions, buildTimeline } from "../timelines/main";

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

  // Combine custom options imported from timelines/maine.js, with necessary Honeycomb options.
  const combinedOptions = {
    ...jsPsychOptions,
    display_element: experimentDivId,
    on_data_update: (data) => dataUpdateFunction(data),
    on_finish: (data) => dataFinishFunction(data),
  };

  // Create the instance of jsPsych that we'll reuse within the scoope of this JsPsychExperiment component.
  // As of jspsych 7, we create our own jspsych instance(s) where needed instead of importing one global instance.
  const setUpJsPsych = () => {
    const jsPsych = initJsPsych(combinedOptions)
    jsPsych.data.addProperties({
      participant_id: participantId,
      study_id: studyId,
      start_date: startDate,
      task_version: taskVersion
    })
    return jsPsych
  }
  const jsPsych = useMemo(setUpJsPsych, [participantId, studyId, startDate, taskVersion]);

  // Build our jspsych experiment timeline (in this case a Honeycomb demo, you could substitute your own here).
  const timeline = buildTimeline(jsPsych)

  // Set up event and lifecycle callbacks to start and stop jspsych.
  // Inspration from jspsych-react: https://github.com/makebrainwaves/jspsych-react/blob/master/src/index.js
  const handleKeyEvent = e => {
    if (e.redispatched) {
      return;
    }
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

  return (
    <div className="App">
      <div id={experimentDivId} style={{ height, width }} ref={experimentDiv} />
    </div>
  );
}

export default JsPsychExperiment;
