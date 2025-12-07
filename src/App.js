// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Importing pages
import Phase1Interview from "./pages/Phase1Interview";
import AptitudeTest from "./pages/AptitudeTest";
import Phase3UI from "./pages/Phase3UI";  // <--- p is SMALL
import Phase4HR from "./pages/Phase4HR";

// Phase 5 file is inside components folder in your project
import Phase5Interview from "./components/Phase5Interview";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-root">
        <Routes>

          {/* Default route → Phase 1 */}
          <Route path="/" element={<Navigate to="/phase1" replace />} />

          {/* Main Phases */}
          <Route path="/phase1" element={<Phase1Interview />} />
          <Route path="/aptitude" element={<AptitudeTest />} />
          <Route path="/phase3" element={<Phase3UI />} />
          <Route path="/phase4" element={<Phase4HR />} />
          <Route path="/phase5" element={<Phase5Interview />} />

          {/* Fallback unknown routes */}
          <Route path="*" element={<Navigate to="/phase1" replace />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
