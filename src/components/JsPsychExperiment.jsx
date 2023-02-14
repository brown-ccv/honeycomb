import React, { useEffect, useState } from "react"
import { Experiment } from "jspsych-react"
import tl from "../timelines/main"
import { getConfig } from "../config/experiment"

/**
 * A React component that initializes the jsPsych experiment with the Experiment component. This component is rendered
 * when the participant successfully logs in.
 * @param dataUpdateFunction The function to run after very trial.
 * @param dataFinishFunction The function to run when the experiment finishes.
 * @param participantID The participant ID.
 * @param studyID The study ID.
 * @returns {JSX.Element} The jsPsych experiment.
 */
function JsPsychExperiment ({ dataUpdateFunction, dataFinishFunction, participantID, studyID }) {
  /* State variables. */
  // The experiment config being used.
  const [sourceConfig, setSourceConfig] = useState({})
  // The experiment timeline.
  const [timeline, setTimeline] = useState([])

  /* When participantID or studyID change, this runs. */
  useEffect(() => {
    // Gets the experiment config, constructs the timeline, and updates the state variables.
    getConfig(participantID, studyID).then((experimentConfig) => {
      const newTimeline = tl(experimentConfig)
      setTimeline(newTimeline)
      setSourceConfig(experimentConfig)
    })
  }, [participantID, studyID])

  if (timeline.length === 0) {
    // Because of asynchronicity, a loading page is shown while the timeline is being constructed. Usually only shows
    // for half a second.
    return (
      <div className="App height-100">
        <div className="centered-h-v">Loading task</div>
      </div>
    )
  } else {
    // Starts the experiment.
    return (
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
}

export default JsPsychExperiment
