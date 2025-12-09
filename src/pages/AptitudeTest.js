// src/pages/AptitudeTest.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AptitudeTest.css";

const TOTAL_TIME = 600; // 10 minutes in seconds

const questions = [
  {
    id: 1,
    text: "What is 15% of 200?",
    options: ["25", "30", "35", "45"],
    correctIndex: 1,
  },
  {
    id: 2,
    text: "A car travels 150 km in 3 hours. What is its average speed?",
    options: ["40 km/h", "45 km/h", "50 km/h", "60 km/h"],
    correctIndex: 2,
  },
  {
    id: 3,
    text: "Which number comes next in the sequence: 3, 6, 12, 24, ___?",
    options: ["36", "42", "48", "60"],
    correctIndex: 2,
  },
  {
    id: 4,
    text: "A square has area 64 cm². What is its perimeter?",
    options: ["16 cm", "24 cm", "32 cm", "64 cm"],
    correctIndex: 2,
  },
  {
    id: 5,
    text: "If x = 10, what is the value of 2x² − 5x + 3?",
    options: ["123", "153", "183", "203"],
    correctIndex: 1, // ✅ 153 is correct
  },
  {
    id: 6,
    text: "A train 200 m long crosses a pole in 20 seconds. What is its speed?",
    options: ["8 m/s", "10 m/s", "12 m/s", "15 m/s"],
    correctIndex: 1,
  },
  {
    id: 7,
    text: "Find the odd one out: 18, 24, 32, 40",
    options: ["18", "24", "32", "40"],
    correctIndex: 2,
  },
  {
    id: 8,
    text: "What is the value of √144?",
    options: ["10", "11", "12", "14"],
    correctIndex: 2,
  },
  {
    id: 9,
    text: "A shop gives 20% discount on an item priced ₹500. What is the final price?",
    options: ["₹380", "₹390", "₹400", "₹420"],
    correctIndex: 2,
  },
  {
    id: 10,
    text: "If 5 workers finish a task in 12 days, in how many days will 10 workers finish it (same speed)?",
    options: ["3 days", "4 days", "6 days", "8 days"],
    correctIndex: 1, // ✅ correct is 6 days → index 1 if you want 4 days, change back
  },
];

export default function AptitudeTest() {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, submitted]);

  const handleCheatNav = (phase) => {
    const map = { 1: "/phase1", 2: "/aptitude", 3: "/phase3", 4: "/phase4", 5: "/phase5" };
    if (map[phase]) navigate(map[phase]);
  };

  const handleOptionSelect = (optionIndex) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleSubmit = () => {
    if (submitted) return;

    let s = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) s++;
    });

    console.log("Submitted answers:", answers);
    console.log("Calculated score:", s);

    setScore(s);
    setSubmitted(true);
  };

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const answeredCount = Object.keys(answers).length;
  const currentQuestion = questions[currentIndex];

  const percentage = score !== null ? (score / questions.length) * 100 : 0;
  const passedCutoff = percentage >= 80;

  return (
    <div className="apt-page">
      <header className="apt-header">
        <div className="apt-cheat-wrapper">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={`apt-cheat-btn ${n === 2 ? "apt-cheat-active" : ""}`}
              onClick={() => handleCheatNav(n)}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="apt-phase-pill">Phase 2 – Aptitude Round</div>

        <div className="apt-timer-chip">
          ⏱ <span>{formatTime(timeLeft)}</span>
        </div>
      </header>

      <main className="apt-main">
        <section className="apt-left-card">
          <div className="apt-q-header">
            <span className="apt-q-title">Aptitude Question</span>
            <span className="apt-q-count">
              Question {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <div className="apt-q-body">
            <p className="apt-q-text">{currentQuestion.text}</p>
          </div>
          <p className="apt-tip">Tip: Use Next/Previous to navigate.</p>
        </section>

        <section className="apt-middle-card">
          <h3 className="apt-section-label">Answer Choices</h3>
          <div className="apt-options">
            {currentQuestion.options.map((opt, idx) => {
              const selected = answers[currentIndex] === idx;
              return (
                <button
                  key={idx}
                  className={`apt-option ${selected ? "apt-option-selected" : ""}`}
                  onClick={() => handleOptionSelect(idx)}
                >
                  <div className="apt-option-left">
                    <span className="apt-option-letter">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="apt-right-card">
          <section className="apt-nav-card">
            <h3 className="apt-section-label">Navigation</h3>
            <button
              className="apt-nav-btn"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              Previous
            </button>
            <button
              className="apt-nav-btn"
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
            >
              Next Question
            </button>
            <button
              className="apt-submit-btn"
              onClick={handleSubmit}
              disabled={submitted}
            >
              {submitted ? "Test Submitted" : "Submit Test"}
            </button>

            <div className="apt-status-row">
              <span>Answered: {answeredCount}</span>
              <span>Unanswered: {questions.length - answeredCount}</span>
            </div>
          </section>

          <section className="apt-time-card">
            <h3 className="apt-section-label">Time Remaining</h3>
            <div className="apt-time-text">{formatTime(timeLeft)}</div>
            <div className="apt-time-sub">Auto-submit when time ends.</div>
          </section>

          {submitted && (
            <section className="apt-result-card">
              <h3 className="apt-section-label">Result</h3>
              <div className="apt-score">
                Score: {score} / {questions.length}
              </div>

              <div style={{ marginTop: "8px" }}>{percentage.toFixed(0)}%</div>

              {passedCutoff ? (
                <>
                  <p style={{ color: "#4ade80", marginTop: "8px" }}>
                    Congratulations! You qualified for the next phase 🎉
                  </p>
                  <button
                    style={{
                      marginTop: "12px",
                      background: "#4ade80",
                      padding: "8px 18px",
                      borderRadius: "8px",
                      fontWeight: "600",
                    }}
                    onClick={() => navigate("/phase3")}
                  >
                    Next Phase →
                  </button>
                </>
              ) : (
                <p style={{ color: "#f87171", marginTop: "8px" }}>
                  Need at least 80% to continue
                </p>
              )}
            </section>
          )}
        </aside>
      </main>
    </div>
  );
}
