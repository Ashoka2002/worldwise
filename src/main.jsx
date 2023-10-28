import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ErrorFallback from "./component/ErrorFallback.jsx";
import "./index.css";
import { ErrorBoundary } from "react-error-boundary";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <React.StrictMode
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.replace("/")}
    >
      <App />
    </React.StrictMode>
  </ErrorBoundary>
);
