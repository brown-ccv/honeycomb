import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import initializeCamera from "@jspsych/plugin-initialize-camera";

import { LANGUAGE, config } from "../config/main";
import { baseStimulus } from "../lib/markup/stimuli";
import { div, h1, p, tag } from "../lib/markup/tags";

/**
 * A trial that begins recording the participant using their computer's default camera
 * @param {Object} jsPsych The jsPsych instance being used to run the task
 * @returns {Object} A jsPsych trial object
 */
// TODO #342: refactor to record using web USB
function buildCameraStartTrial(jsPsych) {
  return {
    timeline: [
      {
        // Prompts user permission for camera device
        type: initializeCamera,
        include_audio: true,
        // TODO #342: webm is a subset of mkv, should be able to do a rolling save?
        mime_type: "video/webm",
      },
      {
        // Helps participant center themselves inside the camera
        type: htmlButtonResponse,
        stimulus: () => {
          const videoMarkup = tag("video", "", {
            id: "webcam",
            width: 640,
            height: 480,
            autoplay: true,
          });
          const cameraStartMarkup = p(LANGUAGE.trials.camera.start);
          const trialMarkup = div(cameraStartMarkup + videoMarkup, {
            // TODO #344: Get rid of bootstrap (this is just centering it)
            class: "d-flex flex-column align-items-center",
          });
          return baseStimulus(trialMarkup, true);
        },
        choices: [LANGUAGE.prompts.continue.button],
        response_ends_trial: true,
        on_start: () => {
          // Initialize and store the camera feed
          if (!config.USE_ELECTRON) {
            // TODO #343: We should be able to make this work on both electron and browser?
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
        },
      },
    ],
  };
}

/**
 * A trial that finishes recording the participant using their computer's default camera
 *
 * @param {Number} duration How long to show the trial for
 * @returns {Object} A jsPsych trial object
 */
function buildCameraEndTrial(jsPsych) {
  const recordingEndMarkup = h1(LANGUAGE.trials.camera.end);

  return {
    type: htmlKeyboardResponse,
    // TODO #372: Show photodiodeGhostBox as prompt
    stimulus: baseStimulus(recordingEndMarkup, true),
    trial_duration: 5000,
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

export { buildCameraStartTrial, buildCameraEndTrial };
