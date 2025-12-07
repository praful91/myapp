// src/pages/phase3UI.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Phase3UI.css";

const TOTAL_TIME = 900; // 15 minutes

// 5 MCQ QUESTIONS
const mcqQuestions = [
  {
    id: 1,
    text: "Which data structure uses LIFO (Last In First Out)?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
    correctIndex: 1,
  },
  {
    id: 2,
    text: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctIndex: 1,
  },
  {
    id: 3,
    text: "Which keyword is used to define a function in Python?",
    options: ["func", "define", "def", "lambda"],
    correctIndex: 2,
  },
  {
    id: 4,
    text: "Which of the following is immutable in Python?",
    options: ["List", "Set", "Dictionary", "Tuple"],
    correctIndex: 3,
  },
  {
    id: 5,
    text: "Which operator is used for exponent in Python?",
    options: ["^", "**", "^^", "//"],
    correctIndex: 1,
  },
];

// 5 CODING QUESTIONS
const codingQuestions = [
  {
    id: 6,
    title: "Reverse a String",
    desc: "Write a Python function reverse_string(s) to reverse a string without using slicing [::-1].",
    input: `"hello"`,
    output: `"olleh"`,
  },
  {
    id: 7,
    title: "Maximum Subarray Sum",
    desc: "Implement max_subarray(nums) to return the maximum sum of a contiguous subarray.",
    input: "[-2,1,-3,4,-1,2,1,-5,4]",
    output: "6  (from [4,-1,2,1])",
  },
  {
    id: 8,
    title: "Two Sum",
    desc: "Given nums and target, return indices of two numbers that add up to target (exactly one solution).",
    input: "nums=[2,7,11,15], target=9",
    output: "[0,1]",
  },
  {
    id: 9,
    title: "Count Vowels",
    desc: "Write a function count_vowels(s) that returns the number of vowels (a,e,i,o,u) in the string.",
    input: `"machine"`,
    output: "3",
  },
  {
    id: 10,
    title: "FizzBuzz",
    desc: "Write a function fizzbuzz(n) that returns list from 1..n with Fizz/Buzz/FizzBuzz rules.",
    input: "n = 5",
    output: `[1,2,"Fizz",4,"Buzz"]`,
  },
];

export default function Phase3UI() {
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [submitted, setSubmitted] = useState(false);

  const [mcqAnswers, setMcqAnswers] = useState({}); // {index: optionIndex}
  const [codeAnswers, setCodeAnswers] = useState({}); // {id: text}

  // TIMER
  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, submitted]);

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

  const handleMCQSelect = (qIndex, optIndex) => {
    if (submitted) return;
    setMcqAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleCodeChange = (id, value) => {
    if (submitted) return;
    setCodeAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const formatTime = (t) => {
    const m = String(Math.floor(t / 60)).padStart(2, "0");
    const s = String(t % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  // simple MCQ score (for display only)
  let mcqScore = 0;
  mcqQuestions.forEach((q, idx) => {
    if (mcqAnswers[idx] === q.correctIndex) mcqScore += 1;
  });

  return (
    <div className="p3-page">
      {/* TOP BAR */}
      <header className="p3-header">
        <div className="p3-cheat-wrapper">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={`p3-cheat-btn ${n === 3 ? "p3-cheat-active" : ""}`}
              onClick={() => handleCheatNav(n)}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="p3-phase-pill">Phase 3 – Coding Round</div>

        <div className="p3-timer-chip">⏱ {formatTime(timeLeft)}</div>
      </header>

      {/* MAIN GRID */}
      <main className="p3-main">
        {/* LEFT: MCQs */}
        <section className="p3-left">
          <h2 className="p3-section-title">MCQ Section (5 Questions)</h2>

          {mcqQuestions.map((q, idx) => (
            <div key={q.id} className="p3-mcq-card">
              <p className="p3-mcq-q">
                {idx + 1}. {q.text}
              </p>
              <div className="p3-options">
                {q.options.map((opt, optIndex) => {
                  const isSelected = mcqAnswers[idx] === optIndex;
                  return (
                    <button
                      key={optIndex}
                      className={`p3-option ${
                        isSelected ? "p3-option-selected" : ""
                      }`}
                      onClick={() => handleMCQSelect(idx, optIndex)}
                      disabled={submitted}
                    >
                      {String.fromCharCode(65 + optIndex)}. {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* MIDDLE: Coding */}
        <section className="p3-middle">
          <h2 className="p3-section-title">Coding Section (5 Problems)</h2>

          {codingQuestions.map((q, index) => (
            <div key={q.id} className="p3-code-card">
              <h3 className="p3-code-title">
                {index + 1}. {q.title}
              </h3>
              <p className="p3-code-desc">{q.desc}</p>

              <p className="p3-example">
                <strong>Example Input:</strong> {q.input}
                <br />
                <strong>Expected Output:</strong> {q.output}
              </p>

              <textarea
                className="p3-code-editor"
                placeholder="Write your solution here..."
                value={codeAnswers[q.id] || ""}
                onChange={(e) => handleCodeChange(q.id, e.target.value)}
                disabled={submitted}
              />
            </div>
          ))}
        </section>

        {/* RIGHT: Summary / Submit */}
        <aside className="p3-right">
          <h3 className="p3-section-title">Summary</h3>

          <p>MCQs answered: {Object.keys(mcqAnswers).length} / 5</p>
          <p>Coding attempted: {Object.keys(codeAnswers).length} / 5</p>

          {submitted ? (
            <div className="p3-result-box">
              <h4 className="p3-result-title">Round Submitted ✔</h4>
              <p className="p3-result-text">
                MCQ Score: {mcqScore} / 5
              </p>
              <p className="p3-result-sub">
                Code answers will be evaluated manually / by backend.
              </p>
            </div>
          ) : (
            <button className="p3-submit-btn" onClick={handleSubmit}>
              Submit Coding Round
            </button>
          )}
        </aside>
      </main>
    </div>
  );
}
