// src/pages/Phase1Interview.js
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/Phase1Interview.css";
import DevNav from "../components/DevNav"; // remove if you don't want top nav

export default function Phase1Interview() {
  const navigate = useNavigate();

  // --- Resume upload state + handlers ---
  const [resumeFile, setResumeFile] = useState(null);

  // AI analysis state for dashboard
  const [matchScore, setMatchScore] = useState(75);
  const [matchVerdict, setMatchVerdict] = useState("Awaiting resume analysis");

  // editable skills
  const [skills, setSkills] = useState(["Python", "Machine Learning", "SQL"]);
  const [showAddSkillInput, setShowAddSkillInput] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const fileInputRef = useRef(null);

  // simple front-end scoring demo (no real NLP yet)
  const runLocalAnalysis = (file) => {
    if (!file) return;

    // scoring based on skills count
    const base = 50 + skills.length * 8;
    const bonus = file.name.length % 20;
    let score = base + bonus;

    // clamp so it looks realistic
    if (score < 35) score = 35;
    if (score > 97) score = 97;

    setMatchScore(score);

    if (score >= 80) setMatchVerdict("Excellent match");
    else if (score >= 60) setMatchVerdict("Good match");
    else setMatchVerdict("Needs improvement");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      runLocalAnalysis(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setResumeFile(file);
      runLocalAnalysis(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // skill remove
  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  // show input
  const handleAddSkillClick = () => {
    setShowAddSkillInput(true);
  };

  // confirm input
  const addSkillIfValid = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;

    setSkills((prev) =>
      prev.includes(trimmed) ? prev : [...prev, trimmed]
    );

    setNewSkill("");
    setShowAddSkillInput(false);
  };

  // enter key
  const handleAddSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkillIfValid();
    } else if (e.key === "Escape") {
      setShowAddSkillInput(false);
      setNewSkill("");
    }
  };

  // cheat navigation
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

  // 🔹 NEW: convert matchScore (0–100) to phase-1 score out of 10
  const computePhase1Score = () => {
    // simple conversion: 75% -> 8/10
    return Math.round(matchScore / 10);
  };

  // 🔹 NEW: when going to aptitude, save Phase-1 score for Phase-5 dashboard
  const handleNextPhase = () => {
    const phase1Score = computePhase1Score();

    localStorage.setItem("phase1_score", phase1Score.toString()); // e.g. 8
    localStorage.setItem("phase1_outOf", "10");                    // out of 10
    localStorage.setItem("phase1_matchPercent", matchScore.toString()); // raw %

    // if later you add candidate name/email fields, you can store them here too

    navigate("/aptitude");
  };

  return (
    <div className="p1-page">
      <DevNav />

      <header className="p1-header">
        <div className="p1-cheat-wrapper">
          <button className="p1-cheat-btn" onClick={() => handleCheatNav(1)}>1</button>
          <button className="p1-cheat-btn" onClick={() => handleCheatNav(2)}>2</button>
          <button className="p1-cheat-btn" onClick={() => handleCheatNav(3)}>3</button>
          <button className="p1-cheat-btn" onClick={() => handleCheatNav(4)}>4</button>
          <button className="p1-cheat-btn" onClick={() => handleCheatNav(5)}>5</button>
        </div>

        <div className="p1-phase-pill">Phase 1 – Resume Analyzer</div>
      </header>

      <main className="p1-main">
        {/* LEFT SIDE */}
        <section className="p1-left">
          <h1 className="p1-title">Resume Screening</h1>
          <p className="p1-subtitle">
            Upload the candidate&apos;s resume and review the auto-analysis
            before moving to aptitude.
          </p>

          {/* Required skills */}
          <div className="p1-block">
            <h3 className="p1-block-label">Required Skills</h3>
            <div className="p1-skills-row">
              {skills.map((skill) => (
                <span key={skill} className="p1-skill-chip">
                  {skill}
                  <button
                    type="button"
                    className="p1-skill-chip-close"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    ×
                  </button>
                </span>
              ))}

              {!showAddSkillInput && (
                <button
                  type="button"
                  className="p1-skill-add"
                  onClick={handleAddSkillClick}
                >
                  + Add Skill
                </button>
              )}

              {showAddSkillInput && (
                <input
                  type="text"
                  autoFocus
                  className="p1-add-skill-input"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleAddSkillKeyDown}
                  onBlur={addSkillIfValid}
                  placeholder="Type skill & press Enter"
                />
              )}
            </div>
          </div>

          {/* Job Description */}
          <div className="p1-block">
            <h3 className="p1-block-label">Job Description</h3>
            <div className="p1-card">
              <textarea className="p1-textarea" placeholder="Write a concise, realistic JD..." />
            </div>
          </div>

          {/* Resume Upload */}
          <div className="p1-block">
            <h3 className="p1-block-label">Resume Upload</h3>

            {/* hidden file */}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            {/* visible card */}
            <div
              className={`p1-upload-card ${resumeFile ? "p1-upload-has-file" : ""}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleUploadClick}
            >
              <div className="p1-upload-icon">☁</div>
              <div className="p1-upload-text">
                <div className="p1-upload-main">
                  {resumeFile ? (
                    <>
                      <span className="p1-upload-selected-label">Selected file:&nbsp;</span>
                      <span className="p1-upload-file-name">{resumeFile.name}</span>
                    </>
                  ) : (
                    <>
                      Drag &amp; Drop your Resume{" "}
                      <span className="p1-upload-link">or Click to Upload</span>
                    </>
                  )}
                </div>
                <div className="p1-upload-sub">PDF / DOC / DOCX only</div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="p1-footer">
            <button className="p1-btn-secondary" type="button" onClick={() => navigate(-1)}>
              Back
            </button>
            <button
              className="p1-btn-primary"
              type="button"
              onClick={handleNextPhase}   // 🔹 changed from navigate("/aptitude")
            >
              Next: Aptitude Round →
            </button>
          </div>
        </section>

        {/* RIGHT SIDE (unchanged) */}
        <aside className="p1-right">
          <section className="p1-card p1-dashboard">
            <h2 className="p1-block-label">AI Analysis Dashboard</h2>

            <div className="p1-donut-row">
              <div className="p1-donut-wrap">
                <div
                  className="p1-donut"
                  style={{
                    background: `conic-gradient(#22c55e ${matchScore * 3.6}deg, #111827 0deg)`,
                  }}
                >
                  <div className="p1-donut-inner">
                    <span className="p1-donut-percent">{matchScore}%</span>
                    <span className="p1-donut-caption">Matching Score</span>
                  </div>
                </div>
                <div className="p1-verdict-label">{matchVerdict}</div>
              </div>

              <div className="p1-legend">
                <div className="p1-legend-item">
                  <span className="p1-legend-dot p1-legend-dot-match" />
                  Match
                </div>
                <div className="p1-legend-item">
                  <span className="p1-legend-dot p1-legend-dot-gap" />
                  Gap
                </div>
              </div>
            </div>

            <div className="p1-stats-row">
              <div className="p1-stat-card">
                <div className="p1-stat-number">20</div>
                <div className="p1-stat-label">Total Profiles</div>
              </div>
              <div className="p1-stat-card">
                <div className="p1-stat-number">12</div>
                <div className="p1-stat-label">Good Matches</div>
              </div>
              <div className="p1-stat-card">
                <div className="p1-stat-number">3</div>
                <div className="p1-stat-label">Needs Review</div>
              </div>
            </div>
          </section>

          <section className="p1-card p1-progress-card">
            <h2 className="p1-block-label">Phase Progress</h2>
            <ul className="p1-phase-list">
              <li className="p1-phase-item p1-phase-active">
                <span className="p1-phase-dot" />
                Phase 1 – Resume
              </li>
              <li className="p1-phase-item">
                <span className="p1-phase-dot" />
                Phase 2 – Aptitude
              </li>
              <li className="p1-phase-item">
                <span className="p1-phase-dot" />
                Phase 3 – HR Round
              </li>
              <li className="p1-phase-item">
                <span className="p1-phase-dot" />
                Phase 4 – Video HR
              </li>
              <li className="p1-phase-item">
                <span className="p1-phase-dot" />
                Phase 5 – Final Interview
              </li>
            </ul>
          </section>
        </aside>
      </main>
    </div>
  );
}
