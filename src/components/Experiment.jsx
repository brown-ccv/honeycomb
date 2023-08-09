import { initJsPsych } from "jspsych";
import React, { useEffect } from "react";

import { initParticipant } from "../firebase";

// These will be passed in as props to the package once it's split
import { buildTimeline } from "../JsPsych/timeline";

const EXPERIMENT_ID = "jspsych-experiment-window";

// Based on https://react.dev/reference/react/useEffect#controlling-a-non-react-widget
export default function Experiment({
  config,
  studyID,
  participantID,
  taskVersion,
  dataUpdateFunction,
  dataFinishFunction,
  jsPsychOptions,
}) {
  // Initialize and run JsPsych on first render
  useEffect(() => {
    // Start date of the experiment - used as the UID
    // TODO 169: JsPsych has a built in timestamp function
    const startDate = new Date().toISOString();

    // Write the initial record to Firestore
    if (config.USE_FIREBASE) initParticipant(studyID, participantID, startDate);

    // Initialize experiment, user passed options are merged with defaults
    const jsPsych = initJsPsych({
      display_element: EXPERIMENT_ID,
      on_data_update: (data) => dataUpdateFunction(data),
      on_finish: (data) => dataFinishFunction(data),
      ...jsPsychOptions,
    });
    // Add experiment data to the trials
    jsPsych.data.addProperties({
      study_id: studyID,
      participant_id: participantID,
      start_date: startDate,
      task_version: taskVersion,
    });

    // Run the experiment
    jsPsych.run(buildTimeline());

    // TODO: Return to home page after experiment completes
    return () => {
      console.log("out of useEffect");
    };
  }, []);

  return <div id={EXPERIMENT_ID} />;
}
