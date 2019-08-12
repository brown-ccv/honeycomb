import React from 'react'
import { Experiment, jsPsych } from 'jspsych-react'
import $ from 'jquery'
import { tl } from './timelines/main'
import { MTURK } from './config/main'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import '@fortawesome/fontawesome-free/css/all.css'
import experimentEnd from './trials/experimentEnd'
import { getTurkUniqueId } from './lib/utils'

const isElectron = !MTURK
let ipcRenderer = false;
let psiturk = false
if (isElectron) {
  const electron = window.require('electron');
  ipcRenderer  = electron.ipcRenderer;
} else {
  /* eslint-disable */
  window.lodash = _.noConflict()
  psiturk = new PsiTurk(getTurkUniqueId(), '/complete')
  /* eslint-enable */
}

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Experiment settings={{
          timeline: tl,
          on_trial_start: () => {
            console.log("Outside Turk:", jsPsych.turk.turkInfo().outsideTurk)
            console.log("Turk:", MTURK)
          },
          on_data_update: (data) => {
            if ( ipcRenderer ) {
              ipcRenderer.send('trigger', data)
              ipcRenderer.send('data', data)
            }
            else if (psiturk) {
                psiturk.recordTrialData(data)
            }
          },
          on_finish: (data) => {
            if ( ipcRenderer ) {
              ipcRenderer.send('data', 'end')
            }
            else if (psiturk) {
                psiturk.saveData()
            }
          },
        }}
        />
      </div>
    );
  }
}

export default App
