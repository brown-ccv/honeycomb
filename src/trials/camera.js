import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import initializeCamera from "@jspsych/plugin-initialize-camera";

import { language, config } from "../config/main";
import { photodiodeGhostBox } from "../lib/markup/photodiode";
import { baseStimulus } from "../lib/markup/stimuli";
import { div, h1, p, tag } from "../lib/markup/tags";

/**
 * A trial that begins recording the participant using their computer's default camera
 * @param {Object} jsPsych The jsPsych instance being used to run the task
 * @returns
 */
// TODO: refactor to record using web USB
function cameraStart(jsPsych) {
  const videoMarkup = tag("video", "", { id: "webcam", width: 640, height: 480, autoplay: true });
  const cameraStartMarkup = p(language.trials.camera.start);
  const markup = div(cameraStartMarkup + videoMarkup, {
    // TODO: Need to get rid of bootstrap (this is just centering it)
    class: "d-flex flex-column align-items-center",
  });

  return {
    timeline: [
      {
        // Prompts user permission for camera device
        type: initializeCamera,
        include_audio: true,
        // TODO: webm is a subset of mkv, should be able to do a rolling save?
        mime_type: "video/webm",
      },
      {
        // Helps participant center themselves inside the camera
        type: htmlButtonResponse,
        stimulus: baseStimulus(markup, true) + photodiodeGhostBox(),
        choices: [language.prompts.continue.button],
        response_ends_trial: true,
        on_start: () => {
          // Initialize and store the camera feed
          if (!config.USE_ELECTRON) {
            // TODO: We should be able to make this work on both electron and browser?
            throw new Error("video recording is only available when running inside Electron");
          }

          const cameraRecorder = jsPsych.pluginAPI.getCameraRecorder();
          if (!cameraRecorder) {
            console.error("Camera is not initialized, no data will be recorded.");
            return;
          }
          const cameraChunks = [];

          // Push data whenever available
          cameraRecorder.addEventListener("dataavailable", (event) => {
            if (event.data.size > 0) cameraChunks.push(event.data);
          });

          // Saves the raw data feed from the participants camera (executed on cameraRecorder.stop()).
          cameraRecorder.addEventListener("stop", () => {
            const blob = new Blob(cameraChunks, { type: cameraRecorder.mimeType });

            // Pass video data to Electron as a base64 encoded string
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => window.electronAPI.saveVideo(reader.result);
          });
        },
        on_load: () => {
          // Assign camera feed to the <video> element
          const camera = document.getElementById("webcam");

          camera.srcObject = jsPsych.pluginAPI.getCameraRecorder().stream;
        },
        on_finish: () => {
          // Begin video recording
          jsPsych.pluginAPI.getCameraRecorder().start();

          setTimeout(() => {}, 1000);
          jsPsych.pluginAPI.getCameraRecorder().stop(); // TEMP
        },
      },
    ],
  };
}

/**
 * A trial that finishes recording the participant using their computer's default camera
 *
 * @param {Number} duration How long to show the trial for
 * @returns
 */
function cameraEnd(jsPsych, duration) {
  const recordingEndMarkup = h1(language.trials.camera.end);

  return {
    type: htmlKeyboardResponse,
    stimulus: baseStimulus(recordingEndMarkup, true) + photodiodeGhostBox(),
    trial_duration: duration,
    on_start: () => {
      // Complete the camera recording

      if (!config.USE_ELECTRON) {
        throw new Error("video recording is only available when running inside Electron");
      }

      const cameraRecorder = jsPsych.pluginAPI.getCameraRecorder();
      if (!cameraRecorder) {
        console.error("Camera is not initialized, no data will be recorded.");
        return;
      }

      cameraRecorder.stop();
    },
  };
}

export { cameraStart, cameraEnd };
