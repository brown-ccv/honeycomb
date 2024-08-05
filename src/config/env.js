import { getProlificId } from "../lib/utils";

const USE_ELECTRON = window.electronAPI !== undefined; // Whether or not the experiment is running in Electron (local app)
const USE_PROLIFIC = getProlificId() !== null; // Whether or not the experiment is running with Prolific
const USE_FIREBASE = import.meta.env.VITE_FIREBASE === "true"; // Whether or not the experiment is running in Firebase (web app)
const USE_CAMERA = import.meta.env.VITE_VIDEO === "true" && USE_ELECTRON; // Whether or not to use video recording
const USE_EEG = import.meta.env.VITE_USE_EEG === "true" && USE_ELECTRON; // Whether or not the EEG/event marker is available (TODO @brown-ccv: This is only used for sending event codes)
const USE_PHOTODIODE = import.meta.env.VITE_USE_PHOTODIODE === "true" && USE_ELECTRON; // whether or not the photodiode is in use

// Configuration object for Honeycomb
const config = {
  // Deployments
  USE_ELECTRON,
  USE_PROLIFIC,
  USE_FIREBASE,
  // Equipment
  USE_PHOTODIODE,
  USE_EEG,
  USE_CAMERA,
};
export default config;
