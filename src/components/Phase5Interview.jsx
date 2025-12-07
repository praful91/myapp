// Phase5Interview.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Phase5Interview.css";

export default function Phase5Interview() {
  const navigate = useNavigate();

  // Demo scores – later you can replace with real data from backend / context
  const scores = {
    overall: 82,
    resumeMatch: 75,
    aptitude: 7, // /10
    codingMcq: 4, // /5
    codingCode: 3, // /5
    hrVideo: 3.5, // /5
  };

  const strengths = [
    "Good match with job skills (Python / ML).",
    "Solid problem-solving in aptitude & coding.",
    "Explains projects clearly.",
  ];

  const improvements = [
    "Shorten HR answers and be more direct.",
    "Practice more aptitude word problems.",
    "Work on optimising code and edge cases.",
  ];

  const overallVerdict =
    scores.overall >= 80
      ? "Strongly Recommended"
      : scores.overall >= 65
      ? "Recommended with Improvements"
      : "Not Recommended (for now)";

  const verdictTag =
    scores.overall >= 80
      ? "success"
      : scores.overall >= 65
      ? "warning"
      : "danger";

  const handleCheatNav = (phase) => {
    const map = {
      1: "/phase1",
      2: "/aptitude",
      3: "/phase3",
      4: "/phase4",
      5: "/phase5",
    };
    const path = map[phase];
    if (path) navigate(path);
  };

  return (
    <div className="p5-page">
      {/* ===== Top Header with cheat buttons ===== */}
      <header className="p5-header">
        <div className="p5-cheat-wrapper">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={`p5-cheat-btn ${n === 5 ? "p5-cheat-active" : ""}`}
              onClick={() => handleCheatNav(n)}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="p5-title">Final Evaluation Dashboard</div>

        <div className="p5-phase-pill">Phase 5 – Results</div>
      </header>

      {/* ===== Main Content ===== */}
      <main className="p5-main">
        {/* Overall score card */}
        <section className="p5-overall-card">
          <div className="p5-overall-left">
            <h2 className="p5-overall-heading">Overall Match Score</h2>
            <p className="p5-overall-sub">
              Combined performance across Resume, Aptitude, Coding and HR
              rounds.
            </p>

            <div className="p5-overall-meta">
              <span className={`p5-verdict-tag p5-verdict-${verdictTag}`}>
                {overallVerdict}
              </span>
              <span className="p5-small-label">
                Candidate: Demo User (can be dynamic later)
              </span>
            </div>
          </div>

          <div className="p5-overall-right">
            <div className="p5-circle">
              <div className="p5-circle-inner">
                <span className="p5-circle-score">{scores.overall}%</span>
                <span className="p5-circle-caption">Overall Score</span>
              </div>
            </div>
          </div>
        </section>

        {/* Round-wise cards */}
        <section className="p5-rounds-grid">
          <div className="p5-round-card">
            <h3>Phase 1 – Resume</h3>
            <p className="p5-round-score">{scores.resumeMatch}% match</p>
            <p className="p5-round-note">
              Skills and projects mostly align with JD.
            </p>
          </div>

          <div className="p5-round-card">
            <h3>Phase 2 – Aptitude</h3>
            <p className="p5-round-score">{scores.aptitude} / 10</p>
            <p className="p5-round-note">
              Good quantitative skills, minor mistakes in word problems.
            </p>
          </div>

          <div className="p5-round-card">
            <h3>Phase 3 – Coding</h3>
            <p className="p5-round-score">
              {scores.codingMcq} / 5 MCQ, {scores.codingCode} / 5 coding
            </p>
            <p className="p5-round-note">
              Understands DSA basics; scope to improve optimisation and edge
              cases.
            </p>
          </div>

          <div className="p5-round-card">
            <h3>Phase 4 – HR Video</h3>
            <p className="p5-round-score">{scores.hrVideo} / 5</p>
            <p className="p5-round-note">
              Confident and calm, answers slightly lengthy at times.
            </p>
          </div>
        </section>

        {/* Bottom grid: strengths + decision */}
        <section className="p5-bottom-grid">
          <div className="p5-strengths-card">
            <div className="p5-two-cols">
              <div>
                <h3 className="p5-sub-heading">Strengths</h3>
                <ul className="p5-list">
                  {strengths.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="p5-sub-heading">Areas to Improve</h3>
                <ul className="p5-list">
                  {improvements.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <aside className="p5-decision-card">
            <h3 className="p5-sub-heading">Final Decision</h3>
            <p className="p5-decision-main">{overallVerdict}</p>
            <p className="p5-decision-role">
              Suggested Role: <strong>Junior Python / AIML Developer</strong>
            </p>
            <p className="p5-decision-note">
              This decision is based on the combined performance across all
              phases. Recruiter can override this after manual review.
            </p>
            <button
              className="p5-primary-btn"
              type="button"
              onClick={() => alert("Download report (demo only).")}
            >
              Download Report (Demo)
            </button>
          </aside>
        </section>
      </main>

      {/* Footer navigation */}
      <footer className="p5-footer">
        <button
          className="p5-secondary-btn"
          type="button"
          onClick={() => navigate("/phase4")}
        >
          ← Back to HR Round
        </button>
        <button
          className="p5-primary-btn"
          type="button"
          onClick={() => alert("Session finished (demo).")}
        >
          Finish Session
        </button>
      </footer>
    </div>
  );
}
