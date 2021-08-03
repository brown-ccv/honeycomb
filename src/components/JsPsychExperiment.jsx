import React, { useEffect, useState } from "react"
import { Experiment } from "jspsych-react"
import tl from "../timelines/main"
import { getLocalConfig } from "../config/experiment"

function JsPsychExperiment ({ dataUpdateFunction, dataFinishFunction, participantID, studyID }) {
  const [sourceConfig, setSourceConfig] = useState({})
  const [timeline, setTimeline] = useState([])

  useEffect(() => {
    getLocalConfig(participantID, studyID).then((experimentConfig) => {
      const newTimeline = tl(experimentConfig)
      setTimeline(newTimeline)
      setSourceConfig(experimentConfig)
    })
  }, [participantID, studyID])

  if (timeline.length === 0) {
    return (
      <div className="App height-100">
        <div className="centered-h-v">Loading task</div>
      </div>
    )
  } else {
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
