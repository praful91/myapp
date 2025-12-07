# backend/app.py (or backend/routes/interview.py)
from flask import Flask, request, jsonify
import os
import time
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/upload-interview", methods=["POST"])
def upload_interview():
    if "file" not in request.files:
        return jsonify({"error":"no file"}), 400
    f = request.files["file"]
    filename = f.filename or f"interview_{int(time.time())}.webm"
    save_path = os.path.join(UPLOAD_FOLDER, filename)
    f.save(save_path)
    # optionally: store metadata into DB, run checks, etc.
    return jsonify({"status":"ok", "filename": filename, "path": save_path})
