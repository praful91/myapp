# backend/app.py
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# In-memory demo data (replace with DB later)
JOBS = [
    {"id": 1, "title": "ML Engineer", "skills": ["Python","Machine Learning","PyTorch"], "description": "Build and deploy ML models."},
    {"id": 2, "title": "Data Analyst", "skills": ["SQL","Python","Pandas"], "description": "Analyze data and create dashboards."}
]

RESUMES = [
    {"id":1, "name":"Aarav N.", "role":"Data Analyst", "skills":["Python","SQL"], "match":82, "file": None},
    {"id":2, "name":"Ishita K.", "role":"ML Engineer", "skills":["PyTorch","NLP"], "match":73, "file": None}
]

@app.route("/")
def home():
    return jsonify({"message":"Flask backend is running!"})

@app.route("/api/jobs", methods=["GET"])
def get_jobs():
    return jsonify({"jobs": JOBS})

@app.route("/api/resumes", methods=["GET"])
def get_resumes():
    return jsonify({"resumes": RESUMES})

@app.route("/api/upload_resume", methods=["POST"])
def upload_resume():
    f = request.files.get("file")
    name = request.form.get("name", "Uploaded Candidate")
    role = request.form.get("role", "Unknown")
    if not f:
        return jsonify({"error":"no file"}), 400
    # save file
    filename = f"{len(os.listdir(UPLOAD_FOLDER))+1}_{f.filename}"
    path = os.path.join(UPLOAD_FOLDER, filename)
    f.save(path)
    new = {"id": len(RESUMES)+1, "name": name, "role": role, "skills": [], "match": 0, "file": filename}
    RESUMES.append(new)
    return jsonify({"ok": True, "resume": new}), 201

@app.route("/uploads/<path:filename>")
def get_uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=False)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
