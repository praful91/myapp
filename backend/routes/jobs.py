from flask import Blueprint, jsonify

job_routes = Blueprint('job_routes', __name__)

@job_routes.route('/', methods=['GET'])
def get_jobs():
    jobs = [
        {"id": 1, "title": "ML Engineer", "skills": ["Python", "PyTorch"], "description": "AI-based job posting."}
    ]
    return jsonify(jobs)
