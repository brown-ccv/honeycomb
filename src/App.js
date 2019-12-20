import React from 'react'
import { Experiment, jsPsych } from 'jspsych-react'
import { tl } from './timelines/main'
import { MTURK, IS_ELECTRON, AT_HOME } from './config/main'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import '@fortawesome/fontawesome-free/css/all.css'
import { getTurkUniqueId, sleep } from './lib/utils'

let ipcRenderer = false;
let psiturk = false
if (IS_ELECTRON) {
  const electron = window.require('electron');
  ipcRenderer  = electron.ipcRenderer;
} else if (MTURK) {
  /* eslint-disable */
  window.lodash = _.noConflict()
  psiturk = new PsiTurk(getTurkUniqueId(), '/complete')
  /* eslint-enable */
}

class App extends React.Component {
  render() {
    console.log("Electron:", IS_ELECTRON)
    console.log("Turk:", MTURK)
    console.log("At home:", AT_HOME)

    return (
      <div className="App">
        <Experiment settings={{
          timeline: tl,
          on_data_update: (data) => {
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
