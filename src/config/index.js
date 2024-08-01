import packageInfo from "../../package.json";
import language from "./language.json";
import settings from "./settings.json";
import env from "./env.js";

export const taskName = packageInfo.name;
export const taskVersion = packageInfo.version;
export const LANGUAGE = language;
export const SETTINGS = settings;
export const ENV = env;