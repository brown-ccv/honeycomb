import { initJsPsych } from "jspsych";
import React from "react";

import { config, taskVersion } from "../../config/main";
import { initParticipant } from "../deployments/firebase";
import { buildTimeline, jsPsychOptions } from "../../timelines/main";

export default function JsPsychExperiment({
  studyID,
  participantID,
  dataUpdateFunction,
  dataFinishFunction,
}) {
  // This will be the div in the dom that holds the experiment.
  // We reference it explicitly here so we can do some plumbing with react, jspsych, and events.
  const experimentDivId = "experimentWindow";

  /**
   * Create the instance of JsPsych whenever the studyID or participantID changes,
   * which occurs then the user logs in.
   *
   * This instance of jsPsych is passed to any trials that need it when the timeline is built.
   */
  const jsPsych = React.useMemo(() => {
    // TODO #169: JsPsych has a built in timestamp function
    // Start date of the experiment - used as the UID of the session
    const startDate = new Date().toISOString();

    // Write the initial record to Firestore
    if (config.USE_FIREBASE) initParticipant(studyID, participantID, startDate);

    const jsPsych = initJsPsych({
      // Combine custom options (src/timelines/main.js) with necessary Honeycomb options.
      ...jsPsychOptions,
      display_element: experimentDivId,
      on_data_update: (data) => {
        jsPsychOptions.on_data_update && jsPsychOptions.on_data_update(data); // Call custom on_data_update function (if provided)
        dataUpdateFunction(data); // Call Honeycomb's on_data_update function
      },
      on_finish: (data) => {
        jsPsychOptions.on_finish && jsPsychOptions.on_finish(data); // Call custom on_finish function (if provided)
        dataFinishFunction(data); // Call Honeycomb's on_finish function
      },
    });

    // Add experiment properties into jsPsych directly
    jsPsych.data.addProperties({
      study_id: studyID,
      participant_id: participantID,
      start_date: startDate,
      task_version: taskVersion,
    });
    return jsPsych;
  }, [studyID, participantID]);

  // Build the experiment timeline
  const timeline = buildTimeline(jsPsych, studyID, participantID);

  /**
   * These useEffect callbacks manage keyboard events between React and the JsPsych experiment
   */
  React.useEffect(() => {
    jsPsych.run(timeline);
  });

  return <div id={experimentDivId} className="App" />;
}
