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

// 5 CODING QUESTIONS (final)
const codingQuestions = [
  {
    id: 6,
    title: "Hollow Diamond Pattern",
    desc:
      "Write a Python program to print a hollow diamond pattern using '*' characters for a given integer N.",
    input: "Input: N (e.g., 4)",
    // solution kept here only for you (not shown in UI)
    output: `num = int(input())
for i in range(num):
    if i == 0:
        print("* " * (2 * num))
    else:
        print("* " * (num - i) + "  " * (4 * i) + "* " * (num - i))
for i in range(1, num + 1):
    if i == num:
        print("* " * (2 * num))
    else:
        print("* " * i + "  " * (4 * (num - i)) + "* " * i)`,
  },
  {
    id: 7,
    title: "Remove Words of Given Length",
    desc:
      "Write a Python program that removes all words from a given string whose length is equal to K.",
    input: "Input: a line of text, then K",
    output: `words = input().split()
k = int(input())
result = []
for w in words:
    if len(w) == k:
        continue
    result.append(w)
print(" ".join(result))`,
  },
  {
    id: 8,
    title: "Recursive Fibonacci",
    desc:
      "Write a recursive function fibonacci(n) that returns the n-th Fibonacci number.",
    input: "Input: n (position in Fibonacci sequence)",
    output: `def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)

n = int(input())
print(fibonacci(n))`,
  },
  {
    id: 9,
    title: "Matrix Max, Min and Sum",
    desc:
      "Given an m x n matrix of integers, print the maximum value, minimum value, and sum of all elements.",
    input: "Input: m n, followed by m rows of n integers",
    output: `def convert_string_to_int(lst):
    new_list = []
    for item in lst:
        new_list.append(int(item))
    return new_list

m, n = input().split()
m, n = int(m), int(n)
nums = []

for _ in range(m):
    row = input().split()
    row = convert_string_to_int(row)
    nums.extend(row)

print(max(nums))
print(min(nums))
print(sum(nums))`,
  },
  {
    id: 10,
    title: "Reverse String (without slicing)",
    desc:
      "Write a Python function reverse_string(s) to reverse a string without using slicing [::-1].",
    input: 'Input: a single string (e.g., "hello")',
    output: `def reverse_string(s):
    result = ""
    for ch in s:
        result = ch + result
    return result

text = input()
print(reverse_string(text))`,
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

  // simple MCQ score
  let mcqScore = 0;
  mcqQuestions.forEach((q, idx) => {
    if (mcqAnswers[idx] === q.correctIndex) mcqScore += 1;
  });

  // Coding score: exact match with expected solution
  const normalize = (str = "") =>
    str.replace(/\r\n/g, "\n").trim(); // ignore extra blank lines at start/end

  let codingScore = 0;
  codingQuestions.forEach((q) => {
    const userCode = codeAnswers[q.id] || "";
    const expectedCode = q.output || "";
    if (normalize(userCode) === normalize(expectedCode)) {
      codingScore += 1;
    }
  });

  const totalScore = mcqScore + codingScore; // out of 10
  const canProceed = totalScore >= 8; // 80%

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

              {/* Only show example input, NOT the solution code */}
              <p className="p3-example">
                <strong>Example Input:</strong> {q.input}
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
            <>
              <div className="p3-result-box">
                <h4 className="p3-result-title">Round Submitted ✔</h4>
                <p className="p3-result-text">MCQ Score: {mcqScore} / 5</p>
                <p className="p3-result-text">
                  Coding Score: {codingScore} / 5
                </p>
                <p className="p3-result-text">
                  Total Score: {totalScore} / 10
                </p>
                <p className="p3-result-sub">
                  Coding marks are given only when the code exactly matches the
                  expected solution.
                </p>
              </div>

              {/* NEXT PHASE BUTTON WITH 80% TOTAL CUTOFF */}
              <button
                className="p3-submit-btn"
                onClick={() => navigate("/phase4")}
                disabled={!canProceed}
              >
                Next Phase (Phase 4)
              </button>

              {!canProceed && (
                <p className="p3-warning">
                  You need at least 80% overall (8 out of 10) to move to the
                  next phase.
                </p>
              )}
            </>
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
