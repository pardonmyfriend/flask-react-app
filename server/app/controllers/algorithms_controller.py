from flask import Blueprint, request, jsonify
from app.models.algorithm import Algorithm

from app.services.algorithms_service import (
    run_pca_service,
    run_tsne_service,
    run_kmeans_service,
    run_dbscan_service,
    run_agglomerative_clustering_service,
)

algorithms_blueprint = Blueprint('algorithms', __name__)

@algorithms_blueprint.route('/get_algorithm_info/<string:algorithm_name>', methods=['GET'])
def get_algorithm_info(algorithm_name):
    try:
        alg_obj = Algorithm(algorithm_name)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

    return jsonify({'algorithm': alg_obj.to_dict()}), 200


@algorithms_blueprint.route('/run_PCA', methods=['POST'])
def run_pca():
    request_data = request.get_json()
    df = request_data.get('data', [])
    params = request_data.get('params', {})
    target = request_data.get('target', '')

    try:
        response = run_pca_service(df, params, target)
        return jsonify(response), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    

@algorithms_blueprint.route('/run_t-SNE', methods=['POST'])
def run_tsne():
    request_data = request.get_json()
    df = request_data.get('data', [])
    params = request_data.get('params', {})
    target = request_data.get('target', '')

    try:
        response = run_tsne_service(df, params, target)
        return jsonify(response), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@algorithms_blueprint.route('/run_K-Means', methods=['POST'])
def run_kmeans():
    request_data = request.get_json()
    df = request_data.get('data', [])
    params = request_data.get('params', {})
    target = request_data.get('target', '')

    try:
        response = run_kmeans_service(df, params, target)
        return jsonify(response), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    
@algorithms_blueprint.route('/run_DBSCAN', methods=['POST'])
def run_dbscan():
    request_data = request.get_json()
    df = request_data.get('data', [])
    params = request_data.get('params', {})
    target = request_data.get('target', '')

    try:
        response = run_dbscan_service(df, params, target)
        return jsonify(response), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    
@algorithms_blueprint.route('/run_Agglomerative Clustering', methods=['POST'])
def run_agglomerative_clustering():
    request_data = request.get_json()
    df = request_data.get('data', [])
    params = request_data.get('params', {})
    target = request_data.get('target', '')

    try:
        response = run_agglomerative_clustering_service(df, params, target)
        return jsonify(response), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    
@algorithms_blueprint.route('/run_KNN', methods=['POST'])
def run_knn():
    request_data = request.get_json()
    df = request_data.get('data', [])
    params = request_data.get('params', {})
    target = request_data.get('target', '')

    try:
        response = run_knn(df, params, target)
        return jsonify(response), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
