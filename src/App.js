import React from 'react'
import { Experiment, jsPsych } from 'jspsych-react'
import { tl } from './timelines/main'
import { config } from './config/main'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import '@fortawesome/fontawesome-free/css/all.css'
import { getTurkUniqueId, sleep } from './lib/utils'
import { addToFirebase, createFirebaseDocument } from './firebase.js'

let ipcRenderer = false;
let psiturk = false
if (config.IS_ELECTRON) {
  const electron = window.require('electron');
  ipcRenderer  = electron.ipcRenderer;
} else if (config.USE_MTURK) {
  /* eslint-disable */
  window.lodash = _.noConflict()
  psiturk = new PsiTurk(getTurkUniqueId(), '/complete')
  /* eslint-enable */
}
const firebase = process.env.FIREBASE;

class App extends React.Component {
  render() {
    console.log("Outside Turk:", jsPsych.turk.turkInfo().outsideTurk)
    console.log("Turk:", config.USE_MTURK)

    return (
      <div className="App">
        <Experiment settings={{
          timeline: tl,
          on_data_update: (data) => {
            if (firebase) {
              if (data.trial_index === 1 ) {
                console.log(data.patient_id)
                createFirebaseDocument(data.patient_id)
                addToFirebase(data)
              }
              if ((data.trial_index > 1 )) {
                addToFirebase(data)
              }
            }
            if ( ipcRenderer ) {
              ipcRenderer.send('data', data)
            }
            else if (psiturk) {
                psiturk.recordTrialData(data)
            }
          },
          on_finish: (data) => {
            if ( ipcRenderer ) {
              ipcRenderer.send('end', 'true')
            }
            else if (psiturk) {
              const completePsiturk = async () => {
                psiturk.saveData()
                await sleep(5000)
                psiturk.completeHIT()
              }
              completePsiturk()
            } else {
              jsPsych.data.get().localSave('csv','neuro-task.csv');
            }
          },
        }}
        />
      </div>
    );
  }
}

export default App
