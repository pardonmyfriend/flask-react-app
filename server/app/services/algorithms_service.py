import pandas as pd
import numpy as np
import time

from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn.cluster import KMeans, AgglomerativeClustering, DBSCAN
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC

from sklearn.metrics import pairwise_distances, silhouette_score, silhouette_samples
from sklearn.manifold import trustworthiness
from sklearn.preprocessing import StandardScaler
from sklearn.tree import _tree

from scipy.cluster.hierarchy import dendrogram, linkage, fcluster
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score,
    roc_curve,
    precision_recall_curve,
    auc
)
def preprocess_data(df, target):
    y = df[target] if target in df.columns else None
    X = df.drop(columns=['id', target], errors='ignore')
    X = X.select_dtypes(exclude=['object'])
    return X, y

def run_pca_service(df, params, target):
    df = pd.DataFrame(df)
    X, y = preprocess_data(df, target)

    pca = PCA(
        n_components=params.get('n_components'), 
        svd_solver=params.get('svd_solver'), 
        whiten=params.get('whiten'), 
        tol=params.get('tol')
    )
    
    df_pca = pca.fit_transform(X)

    df_pca = pd.DataFrame(
        df_pca, 
        columns=[f'PC{i+1}' for i in range(df_pca.shape[1])]
    )

    df_pca['id'] = range(1, len(df_pca)+1)

    df_pca[target] = y

    pca_for_variance = PCA(
        n_components=len(X.columns), 
        svd_solver=params.get('svd_solver'), 
        whiten=params.get('whiten'), 
        tol=params.get('tol')
    )
    
    pca_for_variance.fit(X)
    
    explained_variance = pca_for_variance.explained_variance_ratio_ * 100

    eigenvalues = pca_for_variance.explained_variance_
    total_variance = np.sum(eigenvalues)
    percent_total_variance = eigenvalues / total_variance * 100
    cumulative_eigenvalue = np.cumsum(eigenvalues)
    cumulative_percent = np.cumsum(percent_total_variance)

    eigen_values_data = pd.DataFrame({
        'id': range(1, len(X.columns) + 1),
        'Eigenvalues': eigenvalues,
        '% of total variance': percent_total_variance,
        'Cumulative Eigenvalue': cumulative_eigenvalue,
        'Cumulative %': cumulative_percent
    })
    
    loadings = pd.DataFrame(
        pca.components_.T, 
        columns=[f'PC{i+1}' for i in range(len(pca.components_))], 
        index=X.columns
    )

    correlation_matrix = loadings * np.sqrt(pca.explained_variance_ratio_)

    return {
        "pca_components": df_pca.to_dict(orient='records'),
        "explained_variance": explained_variance.tolist(),
        "eigen_values_data": eigen_values_data.to_dict(orient='records'),
        "original_features": X.columns.tolist(),
        "loadings": loadings.to_dict(orient='index'),
        "correlation_matrix": correlation_matrix.to_dict(orient='index')
    }

def run_tsne_service(df, params, target):
    df = pd.DataFrame(df)
    X, y = preprocess_data(df, target)

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

    df_tsne['id'] = range(1, len(df_tsne)+1)

    df_tsne[target] = y

    original_distances = pairwise_distances(X)
    tsne_distances = pairwise_distances(X_tsne)

    trust_score = trustworthiness(X, X_tsne, n_neighbors=5)

    return {
        "tsne_dataframe": df_tsne.to_dict(orient='records'),
        "original_distances": original_distances.flatten().tolist(),
        "tsne_distances": tsne_distances.flatten().tolist(),
        "trust_score": trust_score,
    }

def run_kmeans_service(df, params, target):
    df = pd.DataFrame(df)
    X, y = preprocess_data(df, target)

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
    df['cluster'] = clusters

    silhouette_avg = silhouette_score(X_scaled, clusters)

    centroids = kmeans.cluster_centers_
    centroids_original = scaler.inverse_transform(centroids)

    centroids_df = pd.DataFrame(
        centroids_original, columns=X.columns
    ).reset_index().rename(columns={"index": "cluster"})

    centroids_df['id'] = range(1, len(centroids_df)+1)

    pca = PCA(n_components=2)
    X_pca = pca.fit_transform(X)
    df_pca = pd.DataFrame(
        X_pca, 
        columns=[f'PC{i+1}' for i in range(X_pca.shape[1])]
    )
    df_pca['cluster'] = clusters
    df_pca['cluster'] = df_pca['cluster'].apply(lambda x: 'Noise' if x == -1 else x)

    df_pca[target] = y

    if len(set(clusters)) > 1:
        silhouette_scores = silhouette_samples(X, clusters)
        df_pca['silhouette_score'] = silhouette_scores
    else:
        silhouette_scores = None

    df_pca['id'] = range(1, len(df_pca)+1)

    return {
        "clustered_dataframe": df.to_dict(orient='records'),
        "silhouette_score": silhouette_avg,
        "centroids": centroids_df.to_dict(orient='records'),
        "pca_dataframe": df_pca.to_dict(orient='records'),
    }

def run_dbscan_service(df, params, target):
    df = pd.DataFrame(df)
    X, y = preprocess_data(df, target)

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
    df_cluster['id'] = range(1, len(df_cluster)+1)
    
    cluster_sizes = df_cluster['cluster'].value_counts().to_dict()

    if 'Noise' not in cluster_sizes:
        cluster_sizes['Noise'] = 0

    cluster_sizes = {str(key): value for key, value in cluster_sizes.items()}

    feature_columns = df_cluster.select_dtypes(include=[np.number]).columns.difference(['cluster', 'id'])

    pca = PCA(n_components=2)
    X_pca = pca.fit_transform(X)
    df_pca = pd.DataFrame(
        X_pca, 
        columns=[f'PC{i+1}' for i in range(X_pca.shape[1])]
    )
    df_pca['cluster'] = clusters
    df_pca['cluster'] = df_pca['cluster'].apply(lambda x: 'Noise' if x == -1 else x)

    if df_cluster[df_cluster['cluster'] != 'Noise'].empty:
        return {
            "cluster_dataframe": df_cluster.to_dict(orient='records'),
            "pca_dataframe": df_pca.to_dict(orient='records'),
            "cluster_sizes": cluster_sizes,
            "silhouette_score": "Not Applicable",
            "centroids": [],
            "intra_cluster_distances": [],
            "inter_cluster_distances": {
                "index": [],
                "columns": [],
                "data": []
            },
        }
    
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

    if len(set(clusters)) > 1:
        silhouette_scores = silhouette_samples(X, clusters)
        df_pca['silhouette_score'] = silhouette_scores
    else:
        silhouette_scores = None

    df_pca['id'] = range(1, len(df_pca)+1)

    return {
        "cluster_dataframe": df_cluster.to_dict(orient='records'),
        "pca_dataframe": df_pca.to_dict(orient='records'),
        "cluster_sizes": cluster_sizes,
        "silhouette_score": silhouette,
        "centroids": centroids.to_dict(orient='records'),
        "intra_cluster_distances": intra_cluster_distances.to_dict(orient='records'),
        "inter_cluster_distances": inter_cluster_df.to_dict(orient='split'),
    }

def run_agglomerative_clustering_service(df, params, target):
    df = pd.DataFrame(df)
    X, y = preprocess_data(df, target)

    agg = AgglomerativeClustering(
        n_clusters=params.get('n_clusters'),
        linkage=params.get('linkage'),
        distance_threshold=params.get('distance_threshold')
    )
    
    clusters = agg.fit_predict(X)

    silhouette = silhouette_score(X, clusters)

    df_cluster = pd.DataFrame(X)
    df_cluster['cluster'] = clusters
    df_cluster['id'] = range(1, len(df_cluster)+1)
    
    cluster_sizes = df_cluster['cluster'].value_counts().to_dict()

    linkage_matrix = linkage(X, optimal_ordering=True, method=params.get('linkage'))
    if params.get('n_clusters'):
        cluster_labels = fcluster(linkage_matrix, params.get('n_clusters'), criterion='maxclust')
        dendro = dendrogram(linkage_matrix, color_threshold=linkage_matrix[-(params.get('n_clusters')-1), 2], no_plot=True)
    else:
        cluster_labels = fcluster(linkage_matrix, t=params.get('distance_threshold'), criterion='distance')
        dendro = dendrogram(linkage_matrix, color_threshold=params.get('distance_threshold'), no_plot=True)

    dendrogram_data = {
        'color_list': dendro['color_list'],
        'icoord': dendro['icoord'],
        'dcoord': dendro['dcoord'],
        'ivl': dendro['ivl'],
        'leaves': dendro['leaves'],
        'leaves_color_list': dendro['leaves_color_list']
    }

    pca = PCA(n_components=2)
    X_pca = pca.fit_transform(X)
    df_pca = pd.DataFrame(
        X_pca, 
        columns=[f'PC{i+1}' for i in range(X_pca.shape[1])]
    )
    df_pca['cluster'] = clusters
    df_pca['cluster'] = df_pca['cluster'].apply(lambda x: 'Noise' if x == -1 else x)

    return {
        "cluster_dataframe": df_cluster.to_dict(orient='records'),
        "pca_dataframe": df_pca.to_dict(orient='records'),
        "cluster_sizes": cluster_sizes,
        "silhouette_score": silhouette,
        # "intra_cluster_distances": intra_cluster_distances.to_dict(orient='records'),
        # "inter_cluster_distances": inter_cluster_df.to_dict(orient='split'),
        "dendrogram_data": dendrogram_data,
        "threshold": params.get('distance_threshold')
    }

def run_knn_service(df, params, target):
    df = pd.DataFrame(df)
    X, y = preprocess_data(df, target)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.5, random_state=42)

    knn = KNeighborsClassifier(
        n_neighbors=params.get('n_neighbors'),
        algorithm=params.get('algorithm'),
        metric=params.get('metric'),
        p=params.get('p'),
        weights=params.get('weights')
    )

    knn.fit(X_train, y_train) 

    y_pred = knn.predict(X_test)
    y_prob = knn.predict_proba(X_test) if len(np.unique(y)) == 2 else None

    accuracy = accuracy_score(y_test, y_pred)

    unique_classes = sorted(np.unique(y_test))
    unique_classes = [int(c) if isinstance(c, (np.integer, int)) else 
                  float(c) if isinstance(c, (np.floating, float)) else 
                  str(c) for c in unique_classes]
    
    conf_matrix = confusion_matrix(y_test, y_pred)

    class_report = classification_report(y_test, y_pred, output_dict=True)

    roc_data, pr_data = None, None
    if len(np.unique(y)) == 2:
        fpr, tpr, _ = roc_curve(y_test, y_prob[:, 1])
        roc_auc = auc(fpr, tpr)
        roc_data = {"fpr": fpr.tolist(), "tpr": tpr.tolist(), "auc": roc_auc}
        
        precision, recall, _ = precision_recall_curve(y_test, y_prob[:, 1])
        pr_data = {"precision": precision.tolist(), "recall": recall.tolist()}

    df_pred = pd.DataFrame(X_test).reset_index(drop=True)

    y_test = pd.Series(y_test).reset_index(drop=True)
    y_pred = pd.Series(y_pred).reset_index(drop=True)

    df_pred['original class'] = y_test
    df_pred['predicted class'] = y_pred
    df_pred['id'] = range(1, len(df_pred)+1)

    pca = PCA(n_components=2)
    X_pca = pca.fit_transform(X_test)
    df_pca = pd.DataFrame(
        X_pca, 
        columns=[f'PC{i+1}' for i in range(X_pca.shape[1])]
    )

    df_pca['true'] = y_test
    df_pca['pred'] = y_pred

    return {
        "accuracy": accuracy,
        "confusion_matrix": conf_matrix.tolist(),
        "classification_report": class_report,
        "roc_data": roc_data,
        "pr_data": pr_data,
        "pca_dataframe": df_pca.to_dict(orient='records'),
        "dataframe": df_pred.to_dict(orient='records'),
        "unique_classes": unique_classes
    }

def build_tree(clf, tree_structure, node, parent=None):
    if node == -1:
        return
    
    feature = clf.tree_.feature[node]
    threshold = clf.tree_.threshold[node]
    tree_structure["nodes"].append({
        "id": node,
        "feature": feature if feature != -2 else None,
        "threshold": threshold if feature != -2 else None,
        "samples": clf.tree_.n_node_samples[node],
        "value": clf.tree_.value[node].tolist()
    })

    if parent is not None:
        tree_structure["edges"].append({"source": parent, "target": node})

    left_child = clf.tree_.children_left[node]
    build_tree(clf, tree_structure, left_child, node)

    right_child = clf.tree_.children_right[node]
    build_tree(clf, tree_structure, right_child, node)

def run_decision_tree_service(df, params, target):
    df = pd.DataFrame(df)
    X, y = preprocess_data(df, target)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.5, random_state=42)

    decision_tree = DecisionTreeClassifier(
        criterion=params.get('criterion'),
        max_depth=params.get('max_depth'),
        min_samples_split=params.get('min_samples_split'),
        min_samples_leaf=params.get('min_samples_leaf'),
        max_features=params.get('max_features')
    )

    start_time = time.time()
    decision_tree.fit(X_train, y_train)
    train_time = time.time() - start_time

    y_pred = decision_tree.predict(X_test)
    y_prob = decision_tree.predict_proba(X_test) if len(np.unique(y)) == 2 else None

    accuracy = accuracy_score(y_test, y_pred)

    unique_classes = sorted(np.unique(y_test))
    unique_classes = [int(c) if isinstance(c, (np.integer, int)) else 
                  float(c) if isinstance(c, (np.floating, float)) else 
                  str(c) for c in unique_classes]
    
    conf_matrix = confusion_matrix(y_test, y_pred)

    class_report = classification_report(y_test, y_pred, output_dict=True)

    feature_importances = decision_tree.feature_importances_

    n_nodes = decision_tree.tree_.node_count
    leaf_depths = [decision_tree.tree_.max_depth]
    avg_leaf_depth = sum(leaf_depths) / len(leaf_depths)

    summary_df = pd.DataFrame([
        {"Metric": "Accuracy", "Value": accuracy},
        {"Metric": "Training Time (s)", "Value": train_time},
        {"Metric": "Number of Nodes", "Value": n_nodes},
        {"Metric": "Average Leaf Depth", "Value": avg_leaf_depth}
    ])

    roc_data, pr_data = None, None
    if len(np.unique(y)) == 2:
        fpr, tpr, _ = roc_curve(y_test, y_prob[:, 1])
        roc_auc = auc(fpr, tpr)
        roc_data = {"fpr": fpr.tolist(), "tpr": tpr.tolist(), "auc": roc_auc}

        precision, recall, _ = precision_recall_curve(y_test, y_prob[:, 1])
        pr_data = {"precision": precision.tolist(), "recall": recall.tolist()}

    df_pred = pd.DataFrame(X_test).reset_index(drop=True)

    y_test = pd.Series(y_test).reset_index(drop=True)
    y_pred = pd.Series(y_pred).reset_index(drop=True)

    prediction_histogram = pd.Series(y_pred).value_counts()

    df_pred['original class'] = y_test
    df_pred['predicted class'] = y_pred
    df_pred['id'] = range(1, len(df_pred)+1)

    pca = PCA(n_components=2)
    X_pca = pca.fit_transform(X_test)
    df_pca = pd.DataFrame(
        X_pca, 
        columns=[f'PC{i+1}' for i in range(X_pca.shape[1])]
    )

    df_pca['true'] = y_test
    df_pca['pred'] = y_pred

    tree_structure = {
        "nodes": [],
        "edges": []
    }

    build_tree(clf=decision_tree, tree_structure=tree_structure, node=0)

    return {
        "confusion_matrix": conf_matrix.tolist(),
        "classification_report": class_report,
        "roc_data": roc_data,
        "pr_data": pr_data,
        "pca_dataframe": df_pca.to_dict(orient='records'),
        "dataframe": df_pred.to_dict(orient='records'),
        "unique_classes": unique_classes,
        "feature_importances": feature_importances.tolist(),
        "prediction_histogram": prediction_histogram.to_dict(),
        "feature_names": X.columns.tolist(),
        "summary_df": summary_df.to_dict(orient='records'),
        "tree_structure": {
            "nodes": [
                {
                    "id": int(node["id"]),
                    "feature": int(node["feature"]) if node["feature"] is not None else None,
                    "threshold": float(node["threshold"]) if node["threshold"] is not None else None,
                    "samples": int(node["samples"]),
                    "value": [float(v) for v in node["value"][0]]  # Serializacja wartości w liściach
                }
                for node in tree_structure["nodes"]
            ],
            "edges": [
                {"source": int(edge["source"]), "target": int(edge["target"])}
                for edge in tree_structure["edges"]
            ]
        }
    }

def run_svm_service(df, params, target):
    df = pd.DataFrame(df)
    X, y = preprocess_data(df, target)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.5, random_state=42)

    svm = SVC(
        C=params.get('C'),
        degree=params.get('degree'),
        kernel=params.get('kernel'),
        gamma=params.get('gamma'),
        probability=params.get('probability')
    )

    start_time = time.time()
    svm.fit(X_train, y_train)
    train_time = time.time() - start_time

    y_pred = svm.predict(X_test)
    y_prob = svm.predict_proba(X_test) if len(np.unique(y)) == 2 else None

    accuracy = accuracy_score(y_test, y_pred)

    unique_classes = sorted(np.unique(y_test))
    unique_classes = [int(c) if isinstance(c, (np.integer, int)) else 
                  float(c) if isinstance(c, (np.floating, float)) else 
                  str(c) for c in unique_classes]
    
    conf_matrix = confusion_matrix(y_test, y_pred)
    class_report = classification_report(y_test, y_pred, output_dict=True)

    support_vectors = svm.support_vectors_
    y_train_reset = y_train.reset_index(drop=True)

    support_vector_counts = dict(zip(*np.unique(y_train_reset[svm.support_], return_counts=True)))
    support_vector_counts = {int(key) if isinstance(key, (np.integer, int)) else 
                            float(key) if isinstance(key, (np.floating, float)) else 
                            str(key): int(value) for key, value in support_vector_counts.items()}

    df_pred = pd.DataFrame(X_test).reset_index(drop=True)
    y_test = pd.Series(y_test).reset_index(drop=True)
    y_pred = pd.Series(y_pred).reset_index(drop=True)

    df_pred['original class'] = y_test
    df_pred['predicted class'] = y_pred
    df_pred['id'] = range(1, len(df_pred)+1)

    pca = PCA(n_components=2)
    X_pca = pca.fit_transform(X_test)
    df_pca = pd.DataFrame(
        X_pca, 
        columns=[f'PC{i+1}' for i in range(X_pca.shape[1])]
    )
    df_pca['true'] = y_test
    df_pca['pred'] = y_pred

    prediction_histogram = {
        str(k) if isinstance(k, (np.integer, int, np.floating, float)) else k: v
        for k, v in pd.Series(y_pred).value_counts().items()
    }

    return {
        "confusion_matrix": conf_matrix.tolist(),
        "classification_report": class_report,
        "support_vectors": support_vectors.tolist(),
        "support_vector_counts": support_vector_counts,
        "dataframe": df_pred.to_dict(orient='records'),
        "pca_dataframe": df_pca.to_dict(orient='records'),
        "accuracy": accuracy,
        "training_time": train_time,
        "prediction_histogram": prediction_histogram,
        "unique_classes": unique_classes
    }