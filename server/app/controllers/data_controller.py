from flask import Blueprint, request, jsonify
import pandas as pd
from app.models.data import Data

data_blueprint = Blueprint('data', __name__)

@data_blueprint.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error":"No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error":"No selected file"}), 400
    
    if file.filename.endswith('.csv') or file.filename.endswith('.xls') or file.filename.endswith('.xlsx'):
        df = Data.read_data(file)
        
        df = Data.map_data_id(df)
        data = df.to_dict(orient='records')
        return jsonify(data), 200
    else:
        return 'Unsupported file type', 400
    
    