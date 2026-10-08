# Honeycomb

[![DOI:10.1590/1516-4446-2020-1675](https://img.shields.io/badge/DOI-10.1590%2F1516--4446--2020--1675-orange)](https://doi.org/10.1590/1516-4446-2020-1675) [![docs](https://img.shields.io/badge/docs-stable-blue)](https://brown-ccv.github.io/honeycomb-docs/)

_Note: previously named Neuro Task Starter, some references may still refer to it as such._

## Introduction

Honeycomb is an open source task-template repository that combines well-accepted practices and technologies from the cognitive science and web development communities to build psychophysiological tasks that support lab equipment recordings and are ready for deployment to different settings (desktop or online) without significant changes to the code base.

It is maintained by members of the [Center for Computation and Visualization](https://ccv.brown.edu) and the [Neuromotion Lab](http://borton.engin.brown.edu/) at Brown University.

## Documentation

- [Honeycomb Documentation](https://brown-ccv.github.io/honeycomb-docs/)
- [Honeycomb Discussions Board](https://github.com/brown-ccv/honeycomb/discussions)
- [Behavioral Task Hub (Beehive)](https://beehive.ccv.brown.edu)

## Development

Honeycomb is built with [Vite](https://vite.dev) (the app) and [Electron Forge](https://www.electronforge.io) (the desktop installers). Each _setting_ (`home`, `clinic`, `firebase`) has a Vite mode with environment variables in `env/.env.<setting>`.

| Command                   | Description                                                                  |
| ------------------------- | ---------------------------------------------------------------------------- |
| `npm run dev:<home        | clinic>`                                                                     | Run the app in Electron with hot reloading (add `:video` to record video) |
| `npm run dev:firebase`    | Run the web app in the browser (use with `npm run firebase:emulators:start`) |
| `npm run build:<setting>` | Build the app into `dist/`                                                   |
| `npm run package:<windows | mac                                                                          | linux>`                                                                   | Create the installer in `out/` (run `npm run build:<setting>` first) |

Environment variables read by the app (set in `env/.env.<setting>`, they must start with `VITE_` and are public in the built app):
`VITE_FIREBASE`, `VITE_VOLUME`, `VITE_VIDEO`, `VITE_USE_EEG`, `VITE_USE_PHOTODIODE`, `VITE_EVENT_MARKER_PRODUCT_ID`, `VITE_EVENT_MARKER_COM_NAME`, and the Firebase config (`VITE_API_KEY`, `VITE_AUTH_DOMAIN`, `VITE_PROJECT_ID`, `VITE_STORAGE_BUCKET`, `VITE_MESSAGING_SENDER_ID`, `VITE_APP_ID`).
Private values can go in `env/.env.<setting>.local` (ignored by git).

The Electron app also reads `STUDY_ID` and `PARTICIPANT_ID` from the shell it is launched from to pre-fill the login.

## Cite This Work

If you use Honeycomb in your work, please cite:

[Provenza, N.R., Gelin, L.F.F., Mahaphanit, W., McGrath, M.C., Dastin-van Rijn, E.M., Fan, Y., Dhar, R., Frank, M.J., Restrepo, M.I., Goodman, W.K. and Borton, D.A., 2021. Honeycomb: a template for reproducible psychophysiological tasks for clinic, laboratory, and home use. Brazilian Journal of Psychiatry, 44, pp.147-155.](https://doi.org/10.1590/1516-4446-2020-1675)
