import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import "./styles.css";
import "./features/teacher/teacher.css";
import "./features/teacher/dashboard.css";
import "./features/teacher/content-studio-2.css";
import "./features/teacher/classroom-management-2.css";
import "./features/teacher/teacher-progress-2.css";
import "./features/student/tutor/tutor.css";
import "./features/student/student-journey.css";
import "./features/student/quiz-player-2.css";
import "./features/student/lesson-player-2.css";
import "./features/student/student-progress-2.css";
import "./features/offline/offline.css";
import "./features/ai/model-panel.css";
import "./features/content/content-studio-4.css";

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
  });
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
