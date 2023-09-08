import React from "react";
import ReactDOM from "react-dom";

import App from "./App/App.jsx";

import "./App/index.css";

/** Root of the application.
 *
 * This file renders the React application inside the given location (the browser or Electron)
 */
ReactDOM.render(<App />, document.getElementById("root"));
