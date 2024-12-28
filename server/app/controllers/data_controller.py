from flask import Blueprint, request, jsonify
import pandas as pd
from app.models.data import Data
from app.services.data_service import load_dataset_service
from app.services.data_service import (
    get_basic_stats,
    analyze_target,
    get_correlation_matrix,
    get_distributions
)
import json

data_blueprint = Blueprint('data', __name__)

types_dict = {
    'int64' : "numerical",
    'float64' : "numerical",
    'complex128' : "numerical",
    'object' : "nominal",
    'string' : "nominal",
    'datetime' : "nominal",
    'timedelta' : "nominal",
    'period' : "nominal",
    'boolean' : "categorical",
    'category' : "categorical"
}

@data_blueprint.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error":"No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error":"No selected file"}), 400
    
    if file.filename.endswith('.csv') or file.filename.endswith('.xls') or file.filename.endswith('.xlsx'):
        df = Data.read_data(file)
        if Data.validate_data(df):
            df = Data.map_data_id(df)
            Data.set_data(df)
            dat = Data.get_data()
            print("\ndata:")
            print(dat)
            nullValuesAnalysis = Data.analyze_null_values(df)
            uniqueValuesAnalysis = Data.analyze_unique_values(df)
            uniqueValuesList = Data.unique_values_to_list(df)
            columnTypesList = [{"column": col, "type": str(dtype)} for col, dtype in df.dtypes.items()]
            mappedColumnTypes = [
                {
                    "column": item["column"], 
                    "type": types_dict.get(item["type"], "nominal"),
                    "class": 'false',
                    "nullCount": int(nullValuesAnalysis.get(item["column"], 0)),
                    "handleNullValues": 'Ignore',
                    "uniqueValuesCount": int(uniqueValuesAnalysis.get(item["column"], 0)),
                    "uniqueValues": uniqueValuesList.get(item["column"], []),
                    "valueToFillWith": uniqueValuesList.get(item["column"], [])[0] if uniqueValuesList.get(item["column"], []) else None
                }
                for item in columnTypesList
            ]
            Data.set_columnTypes(mappedColumnTypes)
            df = Data.unify_types(df)
            print(df)
            data = df.to_dict(orient='records')
            result = {
                "data": data,
                "types": mappedColumnTypes,
            }
            print(jsonify(result))
            return jsonify(result), 200
        else:
            return jsonify({"error":"Minimum number of rows: 10"}), 400
    else:
        return jsonify({"error":"Unsupported file type"}), 400
    
@data_blueprint.route('/load_dataset/<string:dataset>', methods=['POST'])
def load_dataset(dataset):
    try:
        response = load_dataset_service(dataset)
        return jsonify(response), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    
@data_blueprint.route('/update', methods=['POST'])
def set_types():
    res = request.get_json()

    if not res:
        return jsonify({"error": "No JSON received"}), 400
    else:
        try:
            data = res  # Parsowanie JSON
            print("Received JSON:", data)
            # df = pd.DataFrame(data)
            # print(df)
            # Przekształcanie podsłowników na DataFrame
            #df_cols = pd.DataFrame(data['cols'])
            # df_cols = pd.DataFrame(data['cols']).drop(columns=['headerName', 'width'])
            # df_cols = df_cols.rename(columns={'field': 'column'})
            #df_defaultTypes = pd.DataFrame(data['defaultTypes'])
            # df_defaultTypes = Data.get_columnTypes()
            # datas = Data.get_data()

            # Wyświetlenie obu DataFrame
            # print("df_cols:")
            # print(df_cols)

            # print("\ndf_defaultTypes:")
            # print(df_defaultTypes)

            # print("\ndata:")
            # print(datas)

            print("jestem przed change_types w kontrolerze")
            Data.change_types(data)
            print("jestem po change_types w kontrolerze")
            resultData = Data.get_data().copy()
            print("\nresultData:")
            print(resultData)
            resultColumnTypes = Data.get_columnTypes().copy()
            result = {
                "data": resultData.to_dict(orient="records"),
                "types": resultColumnTypes.to_dict(orient="records")  
            }

        except json.JSONDecodeError:
            print("Invalid JSON data received.")
        print("result", jsonify(result).get_data(as_text=True))
        return jsonify(result), 200
    
@data_blueprint.route('/normalize', methods=['POST'])
def normalize_data():
    res = request.get_json()

    if not res:
        return jsonify({"error": "No JSON received"}), 400
    else:
        try:
            data = res  # Parsowanie JSON
            print("Received JSON:", data)
            Data.normalize_numerical(data)
            print("jestem po normalize_data w kontrolerze")
            resultData = Data.get_data().copy()
            print("\nresultData:")
            print(resultData)
            resultColumnTypes = Data.get_columnTypes().copy()
            result = {
                "data": resultData.to_dict(orient="records"),
                "types": resultColumnTypes.to_dict(orient="records")  
            }

        except json.JSONDecodeError:
            print("Invalid JSON data received.")
        print("result", jsonify(result).get_data(as_text=True))
        return jsonify(result), 200
    

# @data_blueprint.route('/set_types', methods=['POST'])
# def set_types():
#     columnTypes = request.get_json()

#     if not columnTypes:
#         return jsonify({"error": "No JSON received"}), 400
    
#     print("Received data:", columnTypes)
#     Data.set_columnTypes(columnTypes)

#     return jsonify({"message": "Data received", "received_data": columnTypes}), 200
    
@data_blueprint.route('/get_data_summary', methods=['POST'])
def get_data_summary():
    request_data = request.get_json()
    df = request_data.get('data', [])
    target = request_data.get('target', '')
    
    df = pd.DataFrame(df)
    df = df.drop(columns=['id'], errors='ignore')

    try:
        response = {
            "basic_stats": get_basic_stats(df),
            "target_analysis": analyze_target(df, target) if target else None,
            "correlation_matrix": get_correlation_matrix(df),
            # "pair_plot": get_pair_plot_data(df, target) if target else None,
            # "missing_data": get_missing_data(df),
            # "distribution": get_distributions(df)
        }
        return jsonify(response), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400