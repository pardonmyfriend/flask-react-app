from flask import Blueprint, request, jsonify
from app.models.algorithm import Algorithm
from sklearn.datasets import load_iris
import pandas as pd
import numpy as np

from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn.cluster import KMeans, AgglomerativeClustering, DBSCAN
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression

algorithms_blueprint = Blueprint('algorithms', __name__)

@algorithms_blueprint.route('/get_algorithm_info/<string:algorithm_name>', methods=['GET'])
def get_algorithm_info(algorithm_name):
    try:
        alg_obj = Algorithm(algorithm_name)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

    return jsonify({'algorithm': alg_obj.to_dict()}), 200


@algorithms_blueprint.route('/run_PCA', methods=['POST'])
def run_PCA():
    request_data = request.get_json()
    params = request_data.get('params', {})
    df = request_data.get('data', [])

    try:
        df = pd.DataFrame(df)

        ids = df['id'] if 'id' in df.columns else None
        species = df['species'] if 'species' in df.columns else None
        
        df = df.drop(columns=['id', 'species'])
        df = df.select_dtypes(exclude=['object'])

        pca = PCA(
            n_components=params.get('n_components'), 
            svd_solver=params.get('svd_solver'), 
            whiten=params.get('whiten'), 
            tol=params.get('tol')
            )
        
        df_pca = pca.fit_transform(df)

        df_pca = pd.DataFrame(
            df_pca, 
            columns=[f'PC{i+1}' for i in range(df_pca.shape[1])]
        )
        if ids is not None:
            df_pca.insert(0, 'id', ids)
        if species is not None:
            df_pca['species'] = species

        pca_for_variance = PCA(
            n_components=len(df.columns), 
            svd_solver=params.get('svd_solver'), 
            whiten=params.get('whiten'), 
            tol=params.get('tol')
            )
        
        pca_for_variance.fit(df)
        
        explained_variance = pca_for_variance.explained_variance_ratio_ * 100

        eigenvalues = pca_for_variance.explained_variance_
        total_variance = np.sum(eigenvalues)
        percent_total_variance = eigenvalues / total_variance * 100
        cumulative_eigenvalue = np.cumsum(eigenvalues)
        cumulative_percent = np.cumsum(percent_total_variance)

        eigen_values_data = pd.DataFrame({
            'id': range(1, len(df.columns) + 1),
            'Wartości własne': eigenvalues,
            '% całkowitej wariancji': percent_total_variance,
            'Kumulatywna wartość własna': cumulative_eigenvalue,
            'Kumulatywny %': cumulative_percent
        })
        
        loadings = pd.DataFrame(
            pca.components_.T, 
            columns=[f'PC{i+1}' for i in range(len(pca.components_))], 
            index=df.columns
        )

        correlation_matrix = loadings * np.sqrt(pca.explained_variance_ratio_)

        pca_data = {
            "pca_components": df_pca.to_dict(orient='records'),
            "explained_variance": explained_variance.tolist(),
            "eigen_values_data": eigen_values_data.to_dict(orient='records'),
            "original_features": df.columns.tolist(),
            "loadings": loadings.to_dict(orient='index'),
            "correlation_matrix": correlation_matrix.to_dict(orient='index')
        }

        print(pca_data)

        return jsonify(pca_data), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400