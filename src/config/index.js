// Re-export the language object
// TODO @brown-ccv #373: Save language in Firebase
import language from "./language.json";
// Re-export the settings object
// TODO @brown-ccv #374: Save settings in Firebase
import settings from "./settings.json";
import env from "./env.js";

export const LANGUAGE = language;
export const SETTINGS = settings;
export const ENV = env;
