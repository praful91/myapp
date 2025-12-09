// src/components/Phase5Interview.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Phase5Interview.css";

export default function Phase5Interview() {
  const navigate = useNavigate();

  // ---- Read scores from localStorage (with safe defaults) ----
  const phase1Score = Number(localStorage.getItem("phase1_score") || 0);
  const phase1OutOf = Number(localStorage.getItem("phase1_outOf") || 10);
  const phase1MatchPercent = Number(
    localStorage.getItem("phase1_matchPercent") || 0
  );

  const phase2Score = Number(localStorage.getItem("phase2_score") || 0);
  const phase2OutOf = Number(localStorage.getItem("phase2_outOf") || 10);
  const phase2Percent = Number(localStorage.getItem("phase2_percent") || 0);

  const phase3Mcq = Number(localStorage.getItem("phase3_mcq") || 0);
  const phase3Coding = Number(localStorage.getItem("phase3_coding") || 0);
  const phase3Total = Number(localStorage.getItem("phase3_total") || 0);
  const phase3OutOf = Number(localStorage.getItem("phase3_outOf") || 10);
  const phase3Percent = Number(localStorage.getItem("phase3_percent") || 0);

  const phase4Score = Number(localStorage.getItem("phase4_score") || 0);
  const phase4OutOf = Number(localStorage.getItem("phase4_outOf") || 20);
  const phase4Percent = Number(localStorage.getItem("phase4_percent") || 0);

  const candidateName =
    localStorage.getItem("candidate_name") || "Candidate";

  // ---- Overall calculation ----
  const {
    overallPercent,
    overallVerdict,
    overallLine,
    overallTagColor,
  } = useMemo(() => {
    const totalEarned =
      phase1Score + phase2Score + phase3Total + phase4Score;
    const totalMax =
      phase1OutOf + phase2OutOf + phase3OutOf + phase4OutOf;

    const pct = totalMax ? Math.round((totalEarned / totalMax) * 100) : 0;

    let verdict = "Needs Improvement";
    let line = "Not recommended at this stage.";
    let color = "#f97316"; // orange by default

    if (pct >= 85) {
      verdict = "Strongly Recommended";
      line = "Excellent performance across all rounds.";
      color = "#22c55e";
    } else if (pct >= 70) {
      verdict = "Recommended";
      line = "Good performance with some areas to improve.";
      color = "#38bdf8";
    } else if (pct >= 60) {
      verdict = "Borderline";
      line = "Average performance, suitable for training roles.";
      color = "#eab308";
    }

    return {
      overallPercent: pct,
      overallVerdict: verdict,
      overallLine: line,
      overallTagColor: color,
    };
  }, [
    phase1Score,
    phase1OutOf,
    phase2Score,
    phase2OutOf,
    phase3Total,
    phase3OutOf,
    phase4Score,
    phase4OutOf,
  ]);

  // ---- Phase-wise feedback helpers ----
  const getPhase1Feedback = () => {
    if (phase1MatchPercent >= 80)
      return "Strong alignment between resume and job description.";
    if (phase1MatchPercent >= 60)
      return "Good match, with some skill gaps.";
    return "Resume needs better alignment with the role.";
  };

  const getPhase2Feedback = () => {
    if (phase2Percent >= 80) return "Strong aptitude and reasoning skills.";
    if (phase2Percent >= 60)
      return "Decent aptitude, but more practice can help.";
    return "Needs more work on quantitative and logical reasoning.";
  };

  const getPhase3Feedback = () => {
    if (phase3Percent >= 80)
      return "Good coding fundamentals and problem solving.";
    if (phase3Percent >= 60)
      return "Basic coding is fine, but improve accuracy and logic.";
    return "Coding and DSA fundamentals need improvement.";
  };

  const getPhase4Feedback = () => {
    if (phase4Percent >= 80)
      return "Confident communication and clear answers.";
    if (phase4Percent >= 60)
      return "Communication is okay, work on structure and clarity.";
    return "HR answers were short or unclear; practice more mock interviews.";
  };

  const handleCheatNav = (phase) => {
    const map = {
      1: "/phase1",
      2: "/aptitude",
      3: "/phase3",
      4: "/phase4",
      5: "/phase5",
    };
    if (map[phase]) navigate(map[phase]);
  };

  const handleRestart = () => {
    // if you want to clear scores here, you can:
    // localStorage.clear();
    navigate("/phase1");
  };

  return (
    <div className="p5-page">
      {/* HEADER */}
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

        <div className="p5-phase-pill">Phase 5 – Final Result Dashboard</div>

        <div className="p5-actions">
          <button className="p5-secondary-btn" onClick={handleRestart}>
            Restart Flow
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="p5-main">
        {/* LEFT: Overall card */}
        <section className="p5-left">
          <div className="p5-card p5-overall-card">
            <div className="p5-overall-header">
              <div>
                <h1 className="p5-title">Overall Match Score</h1>
                <p className="p5-subtitle">
                  Combined performance across Resume, Aptitude, Coding
                  and HR rounds.
                </p>
              </div>
              <div className="p5-candidate-name">
                Candidate: <span>{candidateName}</span>
              </div>
            </div>

            <div className="p5-overall-body">
              <div className="p5-donut-wrap">
                <div
                  className="p5-donut"
                  style={{
                    background: `conic-gradient(${overallTagColor} ${
                      overallPercent * 3.6
                    }deg, #020617 0deg)`,
                  }}
                >
                  <div className="p5-donut-inner">
                    <span className="p5-donut-percent">
                      {overallPercent}%
                    </span>
                    <span className="p5-donut-caption">Overall Score</span>
                  </div>
                </div>

                <div className="p5-overall-verdict">
                  <span
                    className="p5-overall-pill"
                    style={{ color: overallTagColor }}
                  >
                    {overallVerdict}
                  </span>
                  <p className="p5-overall-line">{overallLine}</p>
                </div>
              </div>

              <div className="p5-overall-stats">
                <div className="p5-stat-card">
                  <div className="p5-stat-label">Phase 1 – Resume</div>
                  <div className="p5-stat-value">
                    {phase1Score} / {phase1OutOf}
                  </div>
                </div>
                <div className="p5-stat-card">
                  <div className="p5-stat-label">Phase 2 – Aptitude</div>
                  <div className="p5-stat-value">
                    {phase2Score} / {phase2OutOf}
                  </div>
                </div>
                <div className="p5-stat-card">
                  <div className="p5-stat-label">Phase 3 – Coding</div>
                  <div className="p5-stat-value">
                    {phase3Total} / {phase3OutOf}
                  </div>
                </div>
                <div className="p5-stat-card">
                  <div className="p5-stat-label">Phase 4 – HR</div>
                  <div className="p5-stat-value">
                    {phase4Score} / {phase4OutOf}
                  </div>
                </div>
              </div>
            </div>

            <div className="p5-overall-footer">
              <p>
                Note: This is an internal evaluation dashboard combining
                technical and behavioral performance. Use it to support
                final hiring decisions, not as the only factor.
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT: Phase-wise breakdown */}
        <section className="p5-right">
          {/* Phase 1 */}
          <div className="p5-card p5-phase-card">
            <div className="p5-phase-header">
              <span className="p5-phase-chip">Phase 1</span>
              <span className="p5-phase-title">Resume Screening</span>
              <span className="p5-phase-score">
                {phase1Score} / {phase1OutOf}
              </span>
            </div>
            <p className="p5-phase-percent">
              Match Score: {phase1MatchPercent}%
            </p>
            <p className="p5-phase-feedback">{getPhase1Feedback()}</p>
          </div>

          {/* Phase 2 */}
          <div className="p5-card p5-phase-card">
            <div className="p5-phase-header">
              <span className="p5-phase-chip">Phase 2</span>
              <span className="p5-phase-title">Aptitude Round</span>
              <span className="p5-phase-score">
                {phase2Score} / {phase2OutOf}
              </span>
            </div>
            <p className="p5-phase-percent">
              Accuracy: {phase2Percent}%
            </p>
            <p className="p5-phase-feedback">{getPhase2Feedback()}</p>
          </div>

          {/* Phase 3 */}
          <div className="p5-card p5-phase-card">
            <div className="p5-phase-header">
              <span className="p5-phase-chip">Phase 3</span>
              <span className="p5-phase-title">Coding Round</span>
              <span className="p5-phase-score">
                {phase3Total} / {phase3OutOf}
              </span>
            </div>
            <p className="p5-phase-percent">
              MCQ: {phase3Mcq}/5 · Coding: {phase3Coding}/5 (
              {phase3Percent}%)
            </p>
            <p className="p5-phase-feedback">{getPhase3Feedback()}</p>
          </div>

          {/* Phase 4 */}
          <div className="p5-card p5-phase-card">
            <div className="p5-phase-header">
              <span className="p5-phase-chip">Phase 4</span>
              <span className="p5-phase-title">HR / Virtual Interview</span>
              <span className="p5-phase-score">
                {phase4Score} / {phase4OutOf}
              </span>
            </div>
            <p className="p5-phase-percent">
              Interview Score: {phase4Percent}%
            </p>
            <p className="p5-phase-feedback">{getPhase4Feedback()}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
