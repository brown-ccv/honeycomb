import { initJsPsych } from "jspsych";
import PropTypes from "prop-types";
import React from "react";

import { CONFIG } from "../../config/";
import { buildTimeline, jsPsychOptions } from "../../experiment";
import { initParticipant } from "../deployments/firebase";

// ID used to identify the DOM element that holds the experiment.
const EXPERIMENT_ID = "experiment-window";

export default function JsPsychExperiment({
  studyID,
  participantID,
  dataUpdateFunction,
  dataFinishFunction,
}) {
  const [jsPsych, setJsPsych] = React.useState();

  /**
   * Create the instance of JsPsych whenever the studyID or participantID changes, which occurs then the user logs in.
   *
   * This instance of jsPsych is passed to any trials that need it when the timeline is built.
   */
  // TODO: The initialization of jsPsych should really happen onSubmit?
  // TODO: JsPsychExperiment gets the instance of jsPsych and the timeline and just runs it?
  React.useEffect(() => {
    async function initializeJsPsych() {
      // Start date of the experiment - used as the UID of the session
      // TODO @brown-ccv #307: Use ISO 8061 date? Doesn't include the punctuation so it's safe for file names
      const startDate = new Date().toISOString();

      // Write the initial record to Firestore
      if (CONFIG.USE_FIREBASE) initParticipant(studyID, participantID, startDate);

      const tempJsPsych = initJsPsych({
        // Combine necessary Honeycomb options with custom ones (src/timelines/main.js)
        ...jsPsychOptions,
        display_element: EXPERIMENT_ID,
        on_data_update: (data) => {
          jsPsychOptions.on_data_update && jsPsychOptions.on_data_update(data); // Call custom on_data_update function (if provided)
          dataUpdateFunction(data); // Call Honeycomb's on_data_update function
        },
        on_finish: (data) => {
          jsPsychOptions.on_finish && jsPsychOptions.on_finish(data); // Call custom on_finish function (if provided)
          dataFinishFunction(data); // Call Honeycomb's on_finish function
        },
      });

      // Adds experiment data into jsPsych directly. These properties will be added to all trials
      tempJsPsych.data.addProperties({
        app_name: import.meta.env.PACKAGE_NAME,
        app_version: import.meta.env.PACKAGE_VERSION,
        // TODO: This does NOT work when using Firebase as electronAPI isn't set up
        // TODO: Can I just get the file from here anyways?
        // app_commit: await window.electronAPI.getCommit(),
        study_id: studyID,
        participant_id: participantID,
        start_date: startDate,
      });
      setJsPsych(tempJsPsych);
    }
    initializeJsPsych();
  }, [studyID, participantID]);

  /**
   * Builds and runs the experiment timeline, which occurs whenever an instance of JsPsych is created
   * NOTE: We must check if jsPsych is defined because it hasn't been created on first render
   */
  React.useEffect(() => {
    if (jsPsych) {
      const timeline = buildTimeline(jsPsych, studyID, participantID);
      jsPsych.run(timeline);
    }
  }, [jsPsych]);

  return <div id={EXPERIMENT_ID} />;
}

JsPsychExperiment.propTypes = {
  studyID: PropTypes.string,
  participantID: PropTypes.string,
  dataUpdateFunction: PropTypes.func,
  dataFinishFunction: PropTypes.func,
};
