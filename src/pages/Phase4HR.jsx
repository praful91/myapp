// src/pages/Phase4HR.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Phase4HR.css";

const QUESTION_TIME = 60; // seconds

const QUESTIONS = [
  "Tell me about yourself in 60 seconds.",
  "Why should we hire you for this role?",
  "What are your strengths and weaknesses?",
  "Describe a challenging problem you solved recently.",
  "Where do you see yourself in the next 3 years?"
];

export default function Phase4HR() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(QUESTION_TIME);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [interviewScore, setInterviewScore] = useState(0); // score out of 20
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text:
        "Welcome to the AI-powered virtual interview. Answer verbally when a question appears."
    }
  ]);

  const maxScore = QUESTIONS.length * 4; // 5 questions * 4 marks

  // ---------------- CAMERA LIVE (preview only) ----------------
  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Could not access camera/mic", err);
      }
    }
    setupCamera();
  }, []);

  // ---------------- QUESTION CHANGE + TTS + TIMER RESET ----------------
  useEffect(() => {
    const q = QUESTIONS[currentQuestionIndex];

    // show question in chat
    setMessages(prev => [
      ...prev,
      {
        from: "bot",
        text: `Question ${currentQuestionIndex + 1} of ${QUESTIONS.length}`
      },
      { from: "bot", text: q }
    ]);

    // reset timer & start "recording"
    setTimer(QUESTION_TIME);
    setIsRecording(true);

    // text-to-speech
    if (
      voiceEnabled &&
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(q);
      utter.rate = 1;
      utter.pitch = 1;
      window.speechSynthesis.speak(utter);
    }
  }, [currentQuestionIndex, voiceEnabled]);

  // ---------------- TIMER COUNTDOWN ----------------
  useEffect(() => {
    if (!isRecording) return;

    if (timer <= 0) {
      // ⏰ time over, user didn’t stop -> 0 marks
      setMessages(prev => [
        ...prev,
        {
          from: "system",
          text:
            "Time’s up, no response detected for this question. 0 marks awarded."
        }
      ]);
      handleNextQuestion(0); // zero marks
      return;
    }

    const id = setTimeout(() => {
      setTimer(t => t - 1);
    }, 1000);

    return () => clearTimeout(id);
  }, [isRecording, timer]);

  // ---------------- MOVE TO NEXT QUESTION + UPDATE SCORE ----------------
  // marksForThisQuestion: 0, 2, or 4
  const handleNextQuestion = (marksForThisQuestion) => {
    if (marksForThisQuestion > 0) {
      setInterviewScore(prev => prev + marksForThisQuestion);
    }

    setIsRecording(false);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
    } else {
      setMessages(prev => [
        ...prev,
        {
          from: "system",
          text:
            "Interview completed. Final interview score calculated. You can proceed to the result phase."
        }
      ]);
    }
  };

  // ---------------- MANUAL STOP (candidate ends answer) ----------------
  const manualStop = () => {
    if (!isRecording) return;

    setIsRecording(false);

    // calculate how long they "spoke"
    const elapsed = QUESTION_TIME - timer; // seconds used
    let marks = 0;

    if (elapsed >= 20 && elapsed <= 30) {
      marks = 2;
    } else if (elapsed > 30) {
      marks = 4;
    } else {
      marks = 0; // < 20s = too short
    }

    setMessages(prev => [
      ...prev,
      {
        from: "system",
        text:
          `Response captured (${elapsed}s). Marks awarded for this question: ${marks}.`
      }
    ]);

    setTimeout(() => {
      handleNextQuestion(marks);
    }, 600);
  };

  const progressPercent =
    ((QUESTION_TIME - timer) / QUESTION_TIME) * 100;

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  const interviewFinished =
    currentQuestionIndex === QUESTIONS.length - 1 && !isRecording;

  return (
    <div className="phase4-page">
      <main className="phase4-main">
        {/* LEFT: Candidate / Camera */}
        <section className="phase4-left-card">
          <div className="phase4-card-header">
            <span className="phase4-card-title">Candidate</span>
            <span className="phase4-status-dot" />
            <span className="phase4-status-text">Camera Live</span>
          </div>

          <div className="phase4-video-wrapper">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="phase4-video"
            />
          </div>

          <div className="phase4-controls-row">
            <div className="phase4-controls-info">
              <span className={isRecording ? "phase4-text-green" : ""}>
                {isRecording ? "Recording..." : "Not recording"}
              </span>
              <span className="phase4-dot-separator">•</span>
              <span>Mic: On</span>
            </div>

            <button
              className={`phase4-primary-btn ${
                isRecording ? "phase4-primary-btn-active" : ""
              }`}
              onClick={manualStop}
              disabled={!isRecording}
            >
              {isRecording ? "Stop Recording" : "Stopped"}
            </button>
          </div>

          <div className="phase4-timer-text">
            Recording time:{" "}
            <span>
              {String(QUESTION_TIME - timer).padStart(2, "0")} /
              {QUESTION_TIME}s
            </span>
          </div>
        </section>

        {/* RIGHT: AI Interviewer */}
        <section className="phase4-right-card">
          <div className="phase4-card-header phase4-right-header">
            <div>
              <span className="phase4-card-title">
                AI Interviewer
              </span>
              <span className="phase4-subtitle">
                {" "}
                (Virtual HR Bot)
              </span>
            </div>
            <div className="phase4-bot-status">
              <span className="phase4-status-dot phase4-status-dot-green" />
              <span className="phase4-status-text">Online</span>

              <button
                className="phase4-voice-toggle"
                onClick={() => setVoiceEnabled(v => !v)}
              >
                {voiceEnabled ? "🔊 Voice: On" : "🔇 Voice: Off"}
              </button>
            </div>
          </div>

          <div className="phase4-current-question-header">
            <div className="phase4-bot-avatar">🤖</div>
            <div>
              <div className="phase4-section-label">
                CURRENT QUESTION
              </div>
              <div className="phase4-question-text">
                {currentQuestion}
              </div>
            </div>
          </div>

          <div className="phase4-listening-row">
            <span className="phase4-text-green">
              I’m listening...
            </span>
            <span className="phase4-listening-sub">
              {isRecording
                ? " your time starts now."
                : " waiting for the next question."}
            </span>
          </div>

          <div className="phase4-progress-bar">
            <div
              className="phase4-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="phase4-qmeta-row">
            <span>
              Question {currentQuestionIndex + 1} / {QUESTIONS.length}
            </span>
            <span>Remaining: {timer}s</span>
          </div>

          {/* Interview score display */}
          <div className="phase4-score-row">
            Interview Score:{" "}
            <span className="phase4-text-green">
              {interviewScore} / {maxScore}
            </span>
          </div>


          <div className="phase4-chat-window">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`phase4-chat-bubble phase4-chat-${m.from}`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="phase4-footer-note">
            The system auto-moves to the next question when time is
            over or you stop recording. After the last question, you
            can go to Phase 5 to see all results.
          </div>

          {/* Phase navigation */}
          <div className="phase4-nav-buttons">
            <button onClick={() => navigate("/phase3")}>
              ← Previous (Phase 3)
            </button>

            {interviewFinished && (
              <button onClick={() => navigate("/phase5")}>
                Next (Phase 5) →
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
