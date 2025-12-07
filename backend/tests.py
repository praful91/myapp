# backend/tests.py
import os
import json
from flask import Blueprint, jsonify, request
from datetime import datetime

tests = Blueprint("tests", __name__)

# === DEMO: 5 LLM-STYLE QUESTIONS (seeded for demo) ===
SAMPLE_QUESTIONS = [
    {
        "id": 1,
        "type": "mcq",
        "stem": "ABCD is a square. E, F, G, H are the midpoints of its sides. What fraction of the square is shaded (the inner diamond)?",
        "image": None,
        "choices": [
            {"id":"A","text":"1/4"},
            {"id":"B","text":"1/2"},
            {"id":"C","text":"1/8"},
            {"id":"D","text":"1/16"}
        ],
        "answer": "A",
        "difficulty": "medium",
        "tag": "geometry"
    },
    {
        "id": 2,
        "type": "mcq",
        "stem": "If x + y = 10 and xy = 21, what is x^2 + y^2?",
        "image": None,
        "choices": [
            {"id":"A","text":"58"},
            {"id":"B","text":"76"},
            {"id":"C","text":"100"},
            {"id":"D","text":"38"}
        ],
        "answer": "A",
        "difficulty": "easy",
        "tag": "algebra"
    },
    {
        "id": 3,
        "type": "mcq",
        "stem": "A train travels 120 km at speed v and returns at speed v+20 km/h. Round trip average speed is 40 km/h. Find v (in km/h).",
        "image": None,
        "choices": [
            {"id":"A","text":"30"},
            {"id":"B","text":"40"},
            {"id":"C","text":"20"},
            {"id":"D","text":"24"}
        ],
        "answer": "D",
        "difficulty": "medium",
        "tag": "speed"
    },
    {
        "id": 4,
        "type": "mcq",
        "stem": "A jar contains red and blue marbles. Probability of drawing a red marble is 3/5. If there are 20 marbles total, how many red marbles?",
        "image": None,
        "choices": [
            {"id":"A","text":"8"},
            {"id":"B","text":"12"},
            {"id":"C","text":"9"},
            {"id":"D","text":"15"}
        ],
        "answer": "B",
        "difficulty": "easy",
        "tag": "probability"
    },
    {
        "id": 5,
        "type": "mcq",
        "stem": "If the series 2, 6, 18, ... is geometric, what is the 6th term?",
        "image": None,
        "choices": [
            {"id":"A","text":"486"},
            {"id":"B","text":"162"},
            {"id":"C","text":"324"},
            {"id":"D","text":"972"}
        ],
        "answer": "A",
        "difficulty": "easy",
        "tag": "sequences"
    }
]

# where results will be saved (persisted)
RESULTS_FILE = os.path.join(os.path.dirname(__file__), "test_results.json")

def load_results():
    if not os.path.exists(RESULTS_FILE):
        return []
    with open(RESULTS_FILE, "r") as f:
        try:
            return json.load(f)
        except:
            return []

def save_result(payload):
    r = load_results()
    r.append(payload)
    with open(RESULTS_FILE, "w") as f:
        json.dump(r, f, indent=2)

@tests.route("/api/test/questions", methods=["GET"])
def get_questions():
    # Return only the questions (no answers) to frontend
    questions_for_client = []
    for q in SAMPLE_QUESTIONS:
        qcopy = {k:v for k,v in q.items() if k != "answer"}
        questions_for_client.append(qcopy)
    return jsonify({"questions": questions_for_client, "count": len(questions_for_client)})

@tests.route("/api/test/submit", methods=["POST"])
def submit_test():
    data = request.get_json() or {}
    # data expected: { candidate: "...", answers: [{qid:1, choice:"B"}, ...], time_taken: integer }
    # evaluate score against SAMPLE_QUESTIONS
    answer_map = { q["id"]: q["answer"] for q in SAMPLE_QUESTIONS }
    correct = 0
    for a in data.get("answers", []):
        try:
            qid = int(a.get("qid"))
        except:
            continue
        if qid in answer_map and answer_map[qid] == a.get("choice"):
            correct += 1
    total = len(SAMPLE_QUESTIONS)
    score_percent = round(100 * correct / max(1, total))
    result = {
        "candidate": data.get("candidate", "demo_candidate"),
        "answers": data.get("answers", []),
        "correct": correct,
        "total": total,
        "score": score_percent,
        "time_taken": data.get("time_taken", 0),
        "created_at": datetime.utcnow().isoformat() + "Z"
    }
    save_result(result)
    return jsonify({"ok": True, "result": result})
