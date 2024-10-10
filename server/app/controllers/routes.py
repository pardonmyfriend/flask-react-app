from flask import Blueprint, request, jsonify
import pandas as pd
from sklearn.datasets import load_iris

data_blueprint = Blueprint('data', __name__)

@data_blueprint.route('/articles', methods=['GET'])
def upload_data():
    articles = [
        { "title": "First Article", "subtitle": "Introduction to Flask and React" },
        { "title": "Second Article", "subtitle": "How to Connect Flask and React" }
    ]
    return jsonify(articles)


@data_blueprint.route('/iris', methods=['GET'])
def get_iris():
    iris = load_iris()
    df = pd.DataFrame(iris.data, columns=iris.feature_names)
    df['target'] = iris.target

    data_json = df.to_json(orient='records')
    
    return jsonify(data_json)
