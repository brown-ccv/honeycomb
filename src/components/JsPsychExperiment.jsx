import React from "react";
import { Experiment } from "jspsych-react";
import { tl } from "../timelines/main";

function JsPsychExperiment({ dataUpdateFunction, dataFinishFunction }) {

  return (
    <div className="App">
      <Experiment
        settings={{
          timeline: tl,
          on_data_update: (data) => dataUpdateFunction(data),
          on_finish: (data) => dataFinishFunction(data),
        }}
      />
    </div>
  );
}
export default JsPsychExperiment;
