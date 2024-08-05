// Re-export the language object
// TODO @brown-ccv #373: Save language in Firebase
import language from "./language.json";
// Re-export the settings object
// TODO @brown-ccv #374: Save settings in Firebase
import settings from "./settings.json";
import config from "./env.js";

export const LANGUAGE = language;
export const SETTINGS = settings;
// Configuration object for Honeycomb
export const CONFIG = config;
