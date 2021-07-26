import React, { useEffect, useState } from "react"
import { Experiment } from "jspsych-react"
import tl from "../timelines/main"
import { getConfig } from "../config/experiment"

function JsPsychExperiment ({ dataUpdateFunction, dataFinishFunction, participantID, studyID }) {
  const [sourceConfig, setSourceConfig] = useState({})
  const [timeline, setTimeline] = useState([])

  useEffect(() => {
    getConfig(participantID, studyID).then(({ sourceConfig, blockConfigs }) => {
      const newTimeline = tl(blockConfigs)
      setTimeline(newTimeline)
      setSourceConfig(sourceConfig)
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
