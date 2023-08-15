import { initJsPsych } from "jspsych";
import React, { useEffect, useMemo, useRef } from "react";

import { config } from "../config/main";
import { initParticipant } from "../firebase";
import { buildTimeline, jsPsychOptions } from "../timelines/main";

function JsPsychExperiment({
  studyId,
  participantId,
  taskVersion,
  dataUpdateFunction,
  dataFinishFunction,
  height = "100%",
  width = "100%",
}) {
  // This will be the div in the dom that holds the experiment.
  // We reference it explicitly here so we can do some plumbing with react, jspsych, and events.
  const experimentDivId = "experimentWindow";
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
  const jsPsych = useMemo(() => {
    // Start date of the experiment - used as the UID
    // TODO 169: JsPsych has a built in timestamp function
    const startDate = new Date().toISOString();

    // Write the initial record to Firestore
    if (config.USE_FIREBASE) initParticipant(studyId, participantId, startDate);

    const jsPsych = initJsPsych(combinedOptions);
    // Add experiment properties into jsPsych directly
    jsPsych.data.addProperties({
      study_id: studyId,
      participant_id: participantId,
      start_date: startDate,
      task_version: taskVersion,
    });
    return jsPsych;
  }, [studyId, participantId, taskVersion]);

  // Build our jspsych experiment timeline (in this case a Honeycomb demo, you could substitute your own here).
  const timeline = buildTimeline(jsPsych);

  // Set up event and lifecycle callbacks to start and stop jspsych.
  // Inspiration from jspsych-react: https://github.com/makebrainwaves/jspsych-react/blob/master/src/index.js
  const handleKeyEvent = (e) => {
    if (e.redispatched) return;

    const newEvent = new e.constructor(e.type, e);
    newEvent.redispatched = true;
    experimentDiv.current.dispatchEvent(newEvent);
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
