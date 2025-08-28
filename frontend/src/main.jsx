import React from "react";
import ThemeWrapper from "./components/layout/MuiTheme.jsx";
import App from "./App.jsx";
import "./styles/fontLoader.js"; // Load Stockholm Type font
import ReactDOM from "react-dom/client";

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <ThemeWrapper>
      <App />
    </ThemeWrapper>
  </React.StrictMode>
);
