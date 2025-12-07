// src/pages/Phase4HR.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Phase4HR.css";

const hrQuestions = [
  "Tell me about yourself in 60 seconds.",
  "Why do you want to join this company?",
  "Describe a challenging situation and how you handled it.",
  "What are your strengths and areas you want to improve?",
  "Where do you see yourself in the next 3 years?",
];

export default function Phase4HR() {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [permissionError, setPermissionError] = useState("");
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // ===== BUTTON CLICK TO REQUEST CAMERA + MIC =====
  const requestPermissions = async () => {
    setPermissionError("");

    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true,
      });

      setStream(s);

      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }

      setPermissionsGranted(true);
    } catch (err) {
      console.error("Media error:", err);
      setPermissionError(
        "Camera / Microphone permission denied or not available. Please allow access."
      );
    }
  };

  // ===== do nothing on mount (only cleanup) =====
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [stream]);

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

  const handleSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    console.log("Snapshot captured (demo).");
  };

  const toggleRecording = () => {
    setRecording((prev) => !prev);
  };

  const handleNextQuestion = () => {
    setCurrentQIndex((idx) =>
      idx < hrQuestions.length - 1 ? idx + 1 : idx
    );
  };

  const handlePrevQuestion = () => {
    setCurrentQIndex((idx) => (idx > 0 ? idx - 1 : idx));
  };

  const handleSubmitInterview = () => {
    setSubmitted(true);
  };

  return (
    <div className="p4-page">
      {/* ===== Top Cheat Strip ===== */}
      <header className="p4-header">
        <div className="p4-cheat-wrapper">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={`p4-cheat-btn ${n === 4 ? "p4-cheat-active" : ""}`}
              onClick={() => handleCheatNav(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="p4-phase-pill">Phase 4 – HR Video Interview</div>
      </header>

      {/* ===== Main two big boxes ===== */}
      <main className="p4-main">
        {/* LEFT: Candidate Camera */}
        <section className="p4-box p4-candidate-box">
          <div className="p4-box-header">
            <div className="p4-box-title-row">
              <span className="p4-box-title">Candidate</span>
              <span
                className={`p4-status-dot ${
                  recording ? "p4-status-on" : "p4-status-off"
                }`}
              />
              <span className="p4-status-text">
                {recording ? "Recording…" : "Camera Live"}
              </span>
            </div>
          </div>

          <div className="p4-video-wrapper">

            {/* === Permission button === */}
            {!permissionsGranted && !permissionError && (
              <button
                className="p4-control-btn p4-control-primary"
                type="button"
                onClick={requestPermissions}
              >
                Enable Camera & Mic
              </button>
            )}

            {/* === Error === */}
            {permissionError && (
              <div className="p4-permission-error">{permissionError}</div>
            )}

            {/* === Video Preview === */}
            {permissionsGranted && !permissionError && (
              <video
                ref={videoRef}
                className="p4-video"
                autoPlay
                muted
              />
            )}
          </div>

          {/* success text */}
          {permissionsGranted && (
            <p style={{ color: "#4ade80", marginTop: 8 }}>
              Permission granted – camera live!
            </p>
          )}

          <div className="p4-video-controls">
            <button
              className="p4-control-btn p4-control-secondary"
              type="button"
              onClick={handleSnapshot}
              disabled={!permissionsGranted}
            >
              Snapshot
            </button>
            <button
              className="p4-control-btn p4-control-primary"
              type="button"
              onClick={toggleRecording}
              disabled={!permissionsGranted}
            >
              {recording ? "Stop Recording" : "Start Recording"}
            </button>
          </div>

          <p className="p4-helper-text">
            Tip: Position yourself clearly and look into the camera. Frames may
            be captured for anti-cheat (demo).
          </p>

          <canvas ref={canvasRef} className="p4-hidden-canvas" />
        </section>

        {/* RIGHT: AI interviewer */}
        <section className="p4-box p4-ai-box">
          <div className="p4-box-header">
            <div className="p4-box-title-row">
              <span className="p4-box-title">AI Interviewer</span>
              <span className="p4-robot-pill">Virtual HR Bot 🤖</span>
            </div>
          </div>

          <div className="p4-ai-body">
            <div className="p4-robot-avatar">🤖</div>

            <div className="p4-question-card">
              <h3 className="p4-question-label">Current Question</h3>
              <p className="p4-question-text">
                {hrQuestions[currentQIndex]}
              </p>
            </div>

            <div className="p4-question-nav">
              <span className="p4-question-count">
                Question {currentQIndex + 1} / {hrQuestions.length}
              </span>
              <div className="p4-question-buttons">
                <button
                  className="p4-mini-btn"
                  onClick={handlePrevQuestion}
                  disabled={currentQIndex === 0}
                >
                  Previous
                </button>
                <button
                  className="p4-mini-btn"
                  onClick={handleNextQuestion}
                  disabled={currentQIndex === hrQuestions.length - 1}
                >
                  Next
                </button>
              </div>
            </div>

            <div className="p4-notes-card">
              <h4 className="p4-notes-title">Short Notes (demo)</h4>
              <textarea
                className="p4-notes-textarea"
                placeholder="Interviewer feedback / candidate remarks can go here…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={submitted}
              />
            </div>

            {submitted && (
              <div className="p4-submitted-banner">
                Interview submitted. Responses will be evaluated by AI / HR.
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ===== Footer ===== */}
      <footer className="p4-footer">
        <button
          className="p4-btn-secondary"
          type="button"
          onClick={() => navigate("/phase3")}
        >
          ← Back to Coding Round
        </button>
        <button
          className="p4-btn-primary"
          type="button"
          onClick={handleSubmitInterview}
          disabled={submitted}
        >
          {submitted ? "Interview Submitted" : "Submit Interview"}
        </button>
      </footer>
    </div>
  );
}
