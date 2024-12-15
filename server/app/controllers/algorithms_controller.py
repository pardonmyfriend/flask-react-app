from flask import Blueprint, request, jsonify
from app.models.algorithm import Algorithm
import pandas as pd
import numpy as np

from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn.cluster import KMeans, AgglomerativeClustering, DBSCAN
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression

from sklearn.metrics import pairwise_distances, silhouette_score, silhouette_samples
from sklearn.manifold import trustworthiness
from sklearn.preprocessing import StandardScaler

from scipy.cluster.hierarchy import dendrogram, linkage


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

        return jsonify(pca_data), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    

@algorithms_blueprint.route('/run_t-SNE', methods=['POST'])
def run_tSNE():
    request_data = request.get_json()
    params = request_data.get('params', {})
    df = request_data.get('data', [])

    try:
        df = pd.DataFrame(df)

        ids = df['id'] if 'id' in df.columns else None
        target = df['species'] if 'species' in df.columns else None
        
        X = df.drop(columns=['id', 'species'])
        X = X.select_dtypes(exclude=['object'])

        tsne = TSNE(
            n_components=params.get('n_components'),
            perplexity=params.get('perplexity'),
            learning_rate=params.get('learning_rate'),
            max_iter=params.get('max_iter'),
            init=params.get('init'),
            metric=params.get('metric')
        )
        
        X_tsne = tsne.fit_transform(X)

        df_tsne = pd.DataFrame(
            X_tsne, 
            columns=[f'F{i+1}' for i in range(X_tsne.shape[1])]
        )
        if ids is not None:
            df_tsne.insert(0, 'id', ids)
        if target is not None:
            df_tsne['species'] = target

        original_distances = pairwise_distances(X)
        tsne_distances = pairwise_distances(X_tsne)

        trust_score = trustworthiness(X, X_tsne, n_neighbors=5)

        tsne_data = {
            "tsne_dataframe": df_tsne.to_dict(orient='records'),
            "original_distances": original_distances.flatten().tolist(),
            "tsne_distances": tsne_distances.flatten().tolist(),
            "trust_score": trust_score,
        }

        return jsonify(tsne_data), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@algorithms_blueprint.route('/run_K-Means', methods=['POST'])
def run_KMeans():
    request_data = request.get_json()
    params = request_data.get('params', {})
    df = request_data.get('data', [])

    try:
        df = pd.DataFrame(df)

        ids = df['id'] if 'id' in df.columns else None
        target = df['species'] if 'species' in df.columns else None
        
        X = df.drop(columns=['id', 'species'])
        X = X.select_dtypes(exclude=['object'])

        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)


        kmeans = KMeans(
            n_clusters=params.get('n_clusters'),
            init=params.get('init'),
            n_init=params.get('n_init'),
            max_iter=params.get('max_iter'),
            tol=params.get('tol'),
            algorithm=params.get('algorithm'),
        )
        
        clusters = kmeans.fit_predict(X_scaled)
        # df.insert(len(df.columns), 'cluster', clusters)
        df['cluster'] = clusters

        silhouette_avg = silhouette_score(X_scaled, clusters)

        centroids = kmeans.cluster_centers_
        centroids_original = scaler.inverse_transform(centroids)

        centroids_df = pd.DataFrame(
            centroids_original, columns=X.columns
        ).reset_index().rename(columns={"index": "cluster"})

        centroids_df['id'] = range(1, len(centroids_df)+1)

        kmeans_data = {
            "clustered_dataframe": df.to_dict(orient='records'),
            "silhouette_score": silhouette_avg,
            "centroids": centroids_df.to_dict(orient='records'),
        }

        return jsonify(kmeans_data), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    
@algorithms_blueprint.route('/run_DBSCAN', methods=['POST'])
def run_dbscan():
    request_data = request.get_json()
    params = request_data.get('params', {})
    df = request_data.get('data', [])

    try:
        df = pd.DataFrame(df)

        ids = df['id'] if 'id' in df.columns else None
        
        X = df.drop(columns=['id', 'species'])
        X = X.select_dtypes(exclude=['object'])

        dbscan = DBSCAN(
            eps=params.get('eps'),
            min_samples=params.get('min_samples'),
            metric=params.get('metric'),
            algorithm=params.get('algorithm')
        )
        
        clusters = dbscan.fit_predict(X)

        df_cluster = pd.DataFrame(X)
        df_cluster['cluster'] = clusters
        df_cluster['cluster'] = df_cluster['cluster'].apply(lambda x: 'Noise' if x == -1 else x)
        df_cluster['id'] = ids
        
        cluster_sizes = df_cluster['cluster'].value_counts().to_dict()

        if 'Noise' not in cluster_sizes:
            cluster_sizes['Noise'] = 0

        cluster_sizes = {str(key): value for key, value in cluster_sizes.items()}

        feature_columns = df_cluster.select_dtypes(include=[np.number]).columns.difference(['cluster', 'id'])
        
        intra_cluster_distances = df_cluster[df_cluster['cluster'] != 'Noise'].groupby('cluster').apply(
            lambda cluster: pairwise_distances(cluster[feature_columns]).mean() if len(cluster) > 1 else 0
        ).reset_index(name='intra-cluster distance')

        centroids = df_cluster[df_cluster['cluster'] != 'Noise'].groupby('cluster')[feature_columns].mean(numeric_only=True).reset_index()
        centroids['id'] = range(1, len(centroids)+1)

        centroid_matrix = centroids[feature_columns].values
        inter_cluster_distances = pairwise_distances(centroid_matrix)

        inter_cluster_df = pd.DataFrame(
            inter_cluster_distances,
            index=centroids['cluster'],
            columns=centroids['cluster']
        )

        if len(set(clusters)) > 1 and len(set(clusters)) != 0:
            silhouette = silhouette_score(X[clusters != -1], clusters[clusters != -1])
        else:
            silhouette = "Not Applicable"
        
        pca = PCA(n_components=2)
        X_pca = pca.fit_transform(X)
        df_pca = pd.DataFrame(
            X_pca, 
            columns=[f'PC{i+1}' for i in range(X_pca.shape[1])]
        )
        df_pca['cluster'] = clusters
        df_pca['cluster'] = df_pca['cluster'].apply(lambda x: 'Noise' if x == -1 else x)

        if len(set(clusters)) > 1:
            silhouette_scores = silhouette_samples(X, clusters)
            df_pca['silhouette_score'] = silhouette_scores
        else:
            silhouette_scores = None

        df_pca['id'] = range(1, len(df_pca)+1)

        dbscan_data = {
            "cluster_dataframe": df_cluster.to_dict(orient='records'),
            "pca_dataframe": df_pca.to_dict(orient='records'),
            "cluster_sizes": cluster_sizes,
            "silhouette_score": silhouette,
            "centroids": centroids.to_dict(orient='records'),
            "intra_cluster_distances": intra_cluster_distances.to_dict(orient='records'),
            "inter_cluster_distances": inter_cluster_df.to_dict(orient='split'),
        }

        return jsonify(dbscan_data), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    
@algorithms_blueprint.route('/run_Agglomerative Clustering', methods=['POST'])
def run_agg_clus():
    request_data = request.get_json()
    params = request_data.get('params', {})
    df = request_data.get('data', [])

    try:
        df = pd.DataFrame(df)

        ids = df['id'] if 'id' in df.columns else None
        
        X = df.drop(columns=['id', 'species'])
        X = X.select_dtypes(exclude=['object'])

        agg = AgglomerativeClustering(
            n_clusters=params.get('n_clusters'),
            linkage=params.get('linkage'),
            distance_threshold=params.get('distance_threshold')
        )
        
        clusters = agg.fit_predict(X)

        silhouette = silhouette_score(X, clusters)

        df_cluster = pd.DataFrame(X)
        df_cluster['cluster'] = clusters
        df_cluster['id'] = ids
        
        cluster_sizes = df_cluster['cluster'].value_counts().to_dict()

        linkage_matrix = linkage(X, optimal_ordering=True, method=params.get('linkage'))
        dendro = dendrogram(linkage_matrix, no_plot=True)
        dendrogram_data = {
            'color_list': dendro['color_list'],
            'icoord': dendro['icoord'],
            'dcoord': dendro['dcoord'],
            'ivl': dendro['ivl'],
            'leaves': dendro['leaves'],
            'leaves_color_list': dendro['leaves_color_list']
        }

        print(linkage_matrix)

        pca = PCA(n_components=2)
        X_pca = pca.fit_transform(X)
        df_pca = pd.DataFrame(
            X_pca, 
            columns=[f'PC{i+1}' for i in range(X_pca.shape[1])]
        )
        df_pca['cluster'] = clusters
        df_pca['cluster'] = df_pca['cluster'].apply(lambda x: 'Noise' if x == -1 else x)

        agg_data = {
            "cluster_dataframe": df_cluster.to_dict(orient='records'),
            "pca_dataframe": df_pca.to_dict(orient='records'),
            "cluster_sizes": cluster_sizes,
            "silhouette_score": silhouette,
            # "intra_cluster_distances": intra_cluster_distances.to_dict(orient='records'),
            # "inter_cluster_distances": inter_cluster_df.to_dict(orient='split'),
            "dendrogram_data": dendrogram_data
        }

        return jsonify(agg_data), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    
@algorithms_blueprint.route('/run_KNN', methods=['POST'])
def run_knn():
    request_data = request.get_json()
    params = request_data.get('params', {})
    df = request_data.get('data', [])

    try:
        df = pd.DataFrame(df)

        ids = df['id'] if 'id' in df.columns else None
        
        X = df.drop(columns=['id', 'species'])
        X = X.select_dtypes(exclude=['object'])
        y = df['species']

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

        agg = AgglomerativeClustering(
            n_clusters=params.get('n_clusters'),
            linkage=params.get('linkage'),
            distance_threshold=params.get('distance_threshold')
        )
        
        clusters = agg.fit_predict(X)

        silhouette = silhouette_score(X, clusters)

        df_cluster = pd.DataFrame(X)
        df_cluster['cluster'] = clusters
        df_cluster['id'] = ids
        
        cluster_sizes = df_cluster['cluster'].value_counts().to_dict()

        linkage_matrix = linkage(X, method='ward')

        pca = PCA(n_components=2)
        X_pca = pca.fit_transform(X)
        df_pca = pd.DataFrame(
            X_pca, 
            columns=[f'PC{i+1}' for i in range(X_pca.shape[1])]
        )
        df_pca['cluster'] = clusters
        df_pca['cluster'] = df_pca['cluster'].apply(lambda x: 'Noise' if x == -1 else x)

        agg_data = {
            "cluster_dataframe": df_cluster.to_dict(orient='records'),
            "pca_dataframe": df_pca.to_dict(orient='records'),
            "cluster_sizes": cluster_sizes,
            "silhouette_score": silhouette,
            # "intra_cluster_distances": intra_cluster_distances.to_dict(orient='records'),
            # "inter_cluster_distances": inter_cluster_df.to_dict(orient='split'),
        }

        return jsonify(agg_data), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
