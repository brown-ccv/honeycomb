import { initJsPsych } from "jspsych";
import React from "react";

import { config } from "../../config/main";
import { initParticipant } from "../deployments/firebase";
import { buildTimeline, jsPsychOptions } from "../../timelines/main";

export default function JsPsychExperiment({
  studyId,
  participantId,
  taskVersion,
  dataUpdateFunction,
  dataFinishFunction,
}) {
  // This will be the div in the dom that holds the experiment.
  // We reference it explicitly here so we can do some plumbing with react, jspsych, and events.
  const experimentDivId = "experimentWindow";
  const experimentDiv = React.useRef(null);

  // Combine custom options imported from timelines/maine.js, with necessary Honeycomb options.
  const combinedOptions = {
    ...jsPsychOptions,
    display_element: experimentDivId,
    on_data_update: (data) => dataUpdateFunction(data),
    on_finish: (data) => dataFinishFunction(data),
  };

  /**
   * Create the instance of JsPsych whenever the studyId, participantId, or taskVersion changes,
   * which occurs then the user logs in.
   *
   * This instance of jsPsych is passed to any trials that need it when the timeline is built.
   */
  const jsPsych = React.useMemo(() => {
    // TODO 169: JsPsych has a built in timestamp function
    // Start date of the experiment - used as the UID of the session
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

  // Build the experiment timeline
  const timeline = buildTimeline(jsPsych);

  /**
   * Callback function used to set up event and lifecycle callbacks to start and stop jspsych.
   * Inspired by jspsych-react: https://github.com/makebrainwaves/jspsych-react/blob/master/src/index.js
   * @param {*} e
   * @returns
   */
  const handleKeyEvent = React.useCallback((e) => {
    if (e.redispatched) return;

    const newEvent = new e.constructor(e.type, e);
    newEvent.redispatched = true;
    experimentDiv.current.dispatchEvent(newEvent);
  }, []);

  /**
   * These useEffect callbacks manage keyboard events between React and the JsPsych experiment
   */
  React.useEffect(() => {
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

  return <div id={experimentDivId} ref={experimentDiv} className="App" />;
}
