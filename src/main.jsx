import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App/App.jsx";

/** Root of the application.
 *
 * This file renders the React application inside the given location (the browser or Electron)
 */
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
