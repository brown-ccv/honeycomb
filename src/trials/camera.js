import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import { language, taskName, config } from "../config/main";
import { photodiodeGhostBox } from "../lib/markup/photodiode";
import { baseStimulus } from "../lib/markup/stimuli";
import { div, h1, p, tag } from "../lib/markup/tags";

/**
 * A trial that begins recording the participant using their computer's default camera
 * @param {Object} jsPsych The jsPsych instance being used to run the task
 * @returns
 */
function cameraStart(jsPsych) {
  document.title = taskName;

  const videoMarkup = tag("video", "", { id: "camera", width: 640, height: 480, autoplay: true });
  const cameraStartMarkup = p(language.trials.camera.start);
  const markup = div(cameraStartMarkup + videoMarkup, {
    class: "d-flex flex-column align-items-center",
  });

  return {
    type: htmlButtonResponse,
    stimulus: baseStimulus(markup, true) + photodiodeGhostBox(),
    choices: [language.prompts.continue.button],
    response_ends_trial: true,
    on_load: () => {
      const participantID = jsPsych.data.get().values()[0].participant_id;
      const camera = document.getElementById("camera"); // Get the HTML object containing the camera

      const handleEvents = function (stream, recorder) {
        console.log(stream);
        if (recorder === "cameraCapture") camera.srcObject = stream;

        const options = { mimeType: "video/webm" };
        const recordedChunks = [];
        window[recorder] = new MediaRecorder(stream, options); // eslint-disable-line no-undef

        window[recorder].addEventListener("dataavailable", (e) => {
          if (e.data.size > 0) recordedChunks.push(e.data);
        });

        // Saves a blob of the raw data feed from the participants camera.
        window[recorder].addEventListener("stop", () => {
          const blob = new Blob(recordedChunks); // eslint-disable-line no-undef

          // Conditionally load electron based on config variable
          let ipcRenderer = false;
          if (config.USE_ELECTRON) {
            const electron = window.require("electron");
            ipcRenderer = electron.ipcRenderer;
          } else {
            throw new Error("cameraStart trial is only available when running inside Electron");
          }
          // Save the data
          const reader = new FileReader(); // eslint-disable-line no-undef
          const fileName = `pid_${participantID}_${recorder}_${Date.now()}.webm`;
          reader.onload = () => {
            if (reader.readyState === 2) {
              const buffer = Buffer.from(reader.result); // eslint-disable-line no-undef
              ipcRenderer.send("save_video", fileName, buffer);
              console.log(`Saving ${JSON.stringify({ fileName, size: blob.size })}`);
            }
          };
          reader.readAsArrayBuffer(blob);
        });
      };

      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => handleEvents(stream, "cameraCapture"));

      // Conditionally load electron based on config variable
      let desktopCapturer = false;
      if (config.USE_ELECTRON) {
        const electron = window.require("electron");
        desktopCapturer = electron.desktopCapturer;
      } else {
        throw new Error("cameraStart trial is only available when running inside Electron");
      }

      desktopCapturer.getSources({ types: ["window"] }).then(async (sources) => {
        for (const source of sources) {
          if (source.name === taskName) {
            navigator.mediaDevices
              .getUserMedia({
                video: {
                  mandatory: {
                    chromeMediaSource: "desktop",
                    chromeMediaSourceId: source.id,
                  },
                },
              })
              .then((stream) => {
                handleEvents(stream, "screenCapture");
              })
              .catch((error) => console.log(error));
          }
        }
      });
    },
    on_finish: () => {
      if (config.USE_CAMERA) {
        try {
          window.cameraCapture.start();
          window.screenCapture.start();
        } catch (error) {
          window.alert(
            "Camera permissions were not given, if you choose to proceed, your recording will not be saved. Please restart the experiment after you have given permission."
          );
        }
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
          window.screenCapture.stop();
        } catch (error) {
          window.alert("Your video recording was not saved");
        }
        console.log("Recording finished");
      }
    },
  };
}

export { cameraStart, cameraEnd };
