// src/components/DevNav.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./DevNav.css";

export default function DevNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // Map each phase number to label + route
  const phases = [
    { id: 1, label: "Resume", path: "/phase1" },
    { id: 2, label: "Aptitude", path: "/aptitude" },
    { id: 3, label: "Coding Round", path: "/phase3" },
    { id: 4, label: "HR Video", path: "/phase4" },
    { id: 5, label: "Final Dashboard", path: "/phase5" },
  ];

  // Find current phase from URL
  const currentPhase = (() => {
    const { pathname } = location;
    return (
      phases.find((p) => pathname.startsWith(p.path)) ?? null
    );
  })();

  return (
    <nav className="devnav-root">
      {/* Left: logo / title */}
      <div className="devnav-left">
        <span className="devnav-dot" />
        <span className="devnav-title">TalentMate AI</span>
      </div>

      {/* Center: 1–5 phase buttons */}
      <div className="devnav-center">
        {phases.map((p) => {
          const isActive = currentPhase && currentPhase.id === p.id;
          return (
            <button
              key={p.id}
              className={`devnav-phase-btn ${
                isActive ? "devnav-phase-btn-active" : ""
              }`}
              onClick={() => navigate(p.path)}
              type="button"
            >
              {p.id}
            </button>
          );
        })}
      </div>

      {/* Right: current phase label */}
      <div className="devnav-right">
        <span className="devnav-phase-label">
          {currentPhase
            ? `Phase ${currentPhase.id} – ${currentPhase.label}`
            : "AI Virtual Interviewer"}
        </span>
      </div>
    </nav>
  );
}
