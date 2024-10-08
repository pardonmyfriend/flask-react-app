from flask import Blueprint, request, jsonify
import pandas as pd

data_blueprint = Blueprint('data', __name__)

@data_blueprint.route('/articles', methods=['GET'])
def upload_data():
    articles = [
        { "title": "First Article", "subtitle": "Introduction to Flask and React" },
        { "title": "Second Article", "subtitle": "How to Connect Flask and React" }
    ]
    return jsonify(articles)
