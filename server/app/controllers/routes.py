from flask import Blueprint, request, jsonify
import pandas as pd
from sklearn.datasets import load_iris

data_blueprint = Blueprint('data', __name__)
upload_blueprint = Blueprint('upload', __name__)

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

@upload_blueprint.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error":"No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error":"No selected file"}), 400
    

    if file.filename.endswith('.csv'):
        df = pd.read_csv(file)
    elif file.filename.endswith('.xls') or file.filename.endswith('.xlsx'):
        df = pd.read_excel(file)
    else:
        return 'Unsupported file type', 400

    data = df.to_dict(orient='records')

    return jsonify(data), 200

    # file_content = file.read()
    # print(file.headers)
    # # Odczytanie pierwszego wiersza pliku XLSX
    # file.seek(0)  # Resetowanie wskaźnika pliku na początek
    # df = pd.read_excel(file)  # Wczytywanie pliku XLSX
    # first_row = df.iloc[0]  # Pobranie pierwszego wiersza
    # print('First row:', first_row.to_dict())  # Wypisanie pierwszego wiersza jako słownik
    # return jsonify({"message": "File received successfully", "filename": file.filename})

