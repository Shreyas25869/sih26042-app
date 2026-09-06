import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import "./styles.css";
import "./features/teacher/teacher.css";
import "./features/teacher/dashboard.css";
import "./features/teacher/content-studio-2.css";
import "./features/student/tutor/tutor.css";
import "./features/student/student-journey.css";
import "./features/offline/offline.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
