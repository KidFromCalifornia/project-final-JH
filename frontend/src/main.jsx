import React from "react";
import ThemeWrapper from "./components/MuiTheme.jsx";
import { App } from "./App.jsx";
import "./index.css";
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
