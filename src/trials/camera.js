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
function cameraStart(jsPsych, participantID) {
  // TODO: ID is the device id of the camera?
  const videoMarkup = tag("video", "", { id: "webcam", width: 640, height: 480, autoplay: true });
  const cameraStartMarkup = p(language.trials.camera.start);
  const markup = div(cameraStartMarkup + videoMarkup, {
    // TODO: Need to get rid of bootstrap (this is just centering it)
    class: "d-flex flex-column align-items-center",
  });

  // TODO: Use initialize camera plugin, get video from there?
  // ?: Initialize microphone plugin too?
  // 1) Prompt for camera permissions
  // 2) Position camera
  // 3) Begin recording (on finish)
  return {
    timeline: [
      {
        // Prompts user permission for camera device
        type: initializeCamera,
        mime_type: "video/webm",
      },
      // TODO: Add initialize microphone trial
      {
        // Helps participant center themselves inside the camera
        type: htmlButtonResponse,
        stimulus: baseStimulus(markup, true) + photodiodeGhostBox(),
        choices: [language.prompts.continue.button],
        response_ends_trial: true,
        on_start: () => {
          if (!config.USE_ELECTRON) {
            // TODO: We should be able to make this work on both electron and browser?
            // ? File size will probably be an issue with Firebase?
            throw new Error("video recording is only available when running inside Electron");
          }

          // TODO: Can we pass the camera recorder to Electron and handle everything there?

          // ! https://github.com/jspsych/jsPsych/blob/main/packages/extension-record-video/src/index.ts
          const cameraRecorder = jsPsych.pluginAPI.getCameraRecorder();
          if (!cameraRecorder) {
            console.error("Camera is not initialized, no data will be recorded.");
            return;
          }
          const cameraChunks = [];

          // TODO: Add microphone recording too
          // const microphoneRecorder = jsPsych.pluginAPI.getMicrophoneRecorder();

          // Push data whenever available
          cameraRecorder.addEventListener("dataavailable", (event) => {
            if (event.data.size > 0) {
              cameraChunks.push(event.data);
            }
          });

          // Saves the raw data feed from the participants camera (called as cameraRecorder.stop()).
          cameraRecorder.addEventListener("stop", () => {
            const blob = new Blob(cameraChunks, { type: cameraRecorder.mimeType });

            // Read blob as a base64 encoded string and send to electron
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.addEventListener("load", () => {
              // Read data as a base64 string
              const data = reader.result.split(",")[1];
              window.electronAPI.saveVideo(data);
            });
          });
        },
        on_load: () => {
          const cameraRecorder = jsPsych.pluginAPI.getCameraRecorder();
          if (!cameraRecorder) {
            console.error("Camera is not initialized, no data will be recorded.");
            return;
          }

          // Assign camera stream to <video> element
          const camera = document.getElementById("webcam");
          camera.srcObject = cameraRecorder.stream;

          // Start recording
          cameraRecorder.start();
        },
        on_finish: () => {
          const cameraRecorder = jsPsych.pluginAPI.getCameraRecorder();
          if (!cameraRecorder) {
            console.error("Camera is not initialized, no data will be recorded.");
            return;
          }
          try {
            // Stop capturing the camera and screen
            // TODO: Start the camera recording here, not on on_load?

            cameraRecorder.stop(); // TODO: this belongs in cameraStop trial
          } catch (error) {
            window.alert("Unable to start recording:\n", error);
          }
        },
      },
    ],
  };

  /* eslint-disable no-unreachable */

  return {
    type: htmlButtonResponse,
    stimulus: baseStimulus(markup, true) + photodiodeGhostBox(),
    choices: [language.prompts.continue.button],
    response_ends_trial: true,
    on_load: () => {
      if (!config.USE_ELECTRON) {
        throw new Error("cameraStart trial is only available when running inside Electron");
      }
      const camera = document.getElementById("camera"); // Get the HTML object containing the camera

      const handleEvents = function (stream, recorder) {
        console.log(stream);
        if (recorder === "cameraCapture") camera.srcObject = stream;

        const options = { mimeType: "video/webm" };
        const recordedChunks = [];
        window[recorder] = new MediaRecorder(stream, options);

        window[recorder].addEventListener("dataavailable", (e) => {
          if (e.data.size > 0) recordedChunks.push(e.data);
        });

        // Saves a blob of the raw data feed from the participants camera.
        window[recorder].addEventListener("stop", () => {
          const blob = new Blob(recordedChunks);
          const reader = new FileReader();

          // TODO: Match filename to experiment json?
          const fileName = `pid_${participantID}_${recorder}_${Date.now()}.webm`;

          reader.onload = () => {
            if (reader.readyState === 2) {
              const buffer = Buffer.from(reader.result);
              window.electronAPI.send("saveVideo", fileName, buffer);
            }
          };
          reader.readAsArrayBuffer(blob);
        });
      };

      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => handleEvents(stream, "cameraCapture"));

      // TODO: desktopCapturer is only available on the main process
      // let desktopCapturer = false;
      // desktopCapturer.getSources({ types: ["window"] }).then(async (sources) => {
      //   for (const source of sources) {
      //     if (source.name === taskName) {
      //       navigator.mediaDevices
      //         .getUserMedia({
      //           video: {
      //             mandatory: {
      //               chromeMediaSource: "desktop",
      //               chromeMediaSourceId: source.id,
      //             },
      //           },
      //         })
      //         .then((stream) => {
      //           handleEvents(stream, "screenCapture");
      //         })
      //         .catch((error) => console.log(error));
      //     }
      //   }
      // });
    },
    on_finish: () => {
      if (!config.USE_ELECTRON) {
        throw new Error("cameraStart trial is only available when running inside Electron");
      }

      try {
        // Start capturing the camera and screen
        // TODO: window.electronAPI.camera("start")
        window.cameraCapture.start();
        // window.screenCapture.start();
      } catch (error) {
        window.alert(
          // "Camera permissions were not given, if you choose to proceed, your recording will not be saved. " +
          // " Please restart the experiment after you have given permission.",
          error
        );
      }
    },
  };
}

/**
 * A trial that finishes recording the participant using their computer's default camera
 *
 * @param {Number} duration How long to show the trial for
 * @returns
 */
function cameraEnd(duration) {
  const recordingEndMarkup = h1(language.trials.camera.start);

  return {
    type: htmlKeyboardResponse,
    stimulus: baseStimulus(recordingEndMarkup, true) + photodiodeGhostBox(),
    trial_duration: duration,
    on_load: () => {
      // Finish the camera recording when the trial first loads
      if (config.USE_CAMERA) {
        try {
          window.cameraCapture.stop();
          // window.screenCapture.stop();
        } catch (error) {
          window.alert("Your video recording was not saved");
        }
        console.log("Recording finished");
      }
    },
  };
}

export { cameraStart, cameraEnd };
