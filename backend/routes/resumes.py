from flask import Blueprint, jsonify

resume_routes = Blueprint('resume_routes', __name__)

@resume_routes.route('/', methods=['GET'])
def get_resumes():
    return jsonify({"message": "Resume route working!"})
