// ============================================================
// main.jsx — React entry point. Mounts <App /> into the DOM.
// ============================================================

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Find the <div id="root"> in index.html and render the app into it
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
