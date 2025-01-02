from flask import Blueprint, request, jsonify
import pandas as pd
from app.models.data import Data

from app.services.algorithms_service import (
    get_algorithm_info_service,
    run_pca_service,
    run_tsne_service,
    run_kmeans_service,
    run_dbscan_service,
    run_agglomerative_clustering_service,
    run_knn_service,
    run_decision_tree_service,
    run_svm_service
)

algorithms_blueprint = Blueprint('algorithms', __name__)

@algorithms_blueprint.route('/get_algorithm_info', methods=['POST'])
def get_algorithm_info():
    request_data = request.get_json()
    algorithm_name = request_data.get('algorithm', '')
    params = request_data.get('params', None)
    data = request_data.get('data', [])
    target = request_data.get('target', '')
    
    try:
        response = get_algorithm_info_service(algorithm_name, params, data, target)
        return jsonify(response), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@algorithms_blueprint.route('/run_PCA', methods=['POST'])
def run_pca():
    request_data = request.get_json()
    df = request_data.get('data', [])
    params = request_data.get('params', {})
    target = request_data.get('target', '')

    print(params)
    print("df:", pd.DataFrame(df))
    df = Data.replaceNaN(df)
    print("df:", pd.DataFrame(df))

    try:
        response = run_pca_service(df, params, target)
        return jsonify(response), 200
    except ValueError as e:
        print({'error': str(e)})
        return jsonify({'error': str(e)}), 400
    

@algorithms_blueprint.route('/run_t-SNE', methods=['POST'])
def run_tsne():
    request_data = request.get_json()
    df = request_data.get('data', [])
    params = request_data.get('params', {})
    target = request_data.get('target', '')

    print("df:", pd.DataFrame(df))
    df = Data.replaceNaN(df)
    print("df:", pd.DataFrame(df))

    try:
        response = run_tsne_service(df, params, target)
        return jsonify(response), 200
    except ValueError as e:
        print({'error': str(e)})
        return jsonify({'error': str(e)}), 400

@algorithms_blueprint.route('/run_K-Means', methods=['POST'])
def run_kmeans():
    request_data = request.get_json()
    df = request_data.get('data', [])
    params = request_data.get('params', {})
    target = request_data.get('target', '')

    print("df:", pd.DataFrame(df))
    df = Data.replaceNaN(df)
    print("df:", pd.DataFrame(df))

    try:
        response = run_kmeans_service(df, params, target)
        return jsonify(response), 200
    except ValueError as e:
        print({'error': str(e)})
        return jsonify({'error': str(e)}), 400
    
@algorithms_blueprint.route('/run_DBSCAN', methods=['POST'])
def run_dbscan():
    request_data = request.get_json()
    df = request_data.get('data', [])
    params = request_data.get('params', {})
    target = request_data.get('target', '')

    print("df:", pd.DataFrame(df))
    df = Data.replaceNaN(df)
    print("df:", pd.DataFrame(df))

    try:
        response = run_dbscan_service(df, params, target)
        return jsonify(response), 200
    except ValueError as e:
        print({'error': str(e)})
        return jsonify({'error': str(e)}), 400
    
@algorithms_blueprint.route('/run_Agglomerative Clustering', methods=['POST'])
def run_agglomerative_clustering():
    request_data = request.get_json()
    df = request_data.get('data', [])
    params = request_data.get('params', {})
    target = request_data.get('target', '')

    print("df:", pd.DataFrame(df))
    df = Data.replaceNaN(df)
    print("df:", pd.DataFrame(df))

    try:
        response = run_agglomerative_clustering_service(df, params, target)
        return jsonify(response), 200
    except ValueError as e:
        print({'error': str(e)})
        return jsonify({'error': str(e)}), 400
    
@algorithms_blueprint.route('/run_KNN', methods=['POST'])
def run_knn():
    request_data = request.get_json()
    df = request_data.get('data', [])
    params = request_data.get('params', {})
    target = request_data.get('target', '')

    print("df:", pd.DataFrame(df))
    df = Data.replaceNaN(df)
    print("df:", pd.DataFrame(df))

    try:
        response = run_knn_service(df, params, target)
        return jsonify(response), 200
    except ValueError as e:
        print({'error': str(e)})
        return jsonify({'error': str(e)}), 400
    
@algorithms_blueprint.route('/run_Decision Tree', methods=['POST'])
def run_decision_tree():
    request_data = request.get_json()
    df = request_data.get('data', [])
    params = request_data.get('params', {})
    target = request_data.get('target', '')

    print("df:", pd.DataFrame(df))
    df = Data.replaceNaN(df)
    print("df:", pd.DataFrame(df))

    try:
        response = run_decision_tree_service(df, params, target)
        return jsonify(response), 200
    except ValueError as e:
        print({'error': str(e)})
        return jsonify({'error': str(e)}), 400
    
@algorithms_blueprint.route('/run_SVM', methods=['POST'])
def run_svm():
    request_data = request.get_json()
    df = request_data.get('data', [])
    params = request_data.get('params', {})
    target = request_data.get('target', '')

    print("df:", pd.DataFrame(df))
    df = Data.replaceNaN(df)
    print("df:", pd.DataFrame(df))

    try:
        response = run_svm_service(df, params, target)
        return jsonify(response), 200
    except ValueError as e:
        print({'error': str(e)})
        return jsonify({'error': str(e)}), 400

