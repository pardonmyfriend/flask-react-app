class Algorithm:
    def __init__(self, algorithm_name, shape, params=None):
        self.algorithm_name = algorithm_name
        self.shape = shape
        self.param_info = self.get_algorithm_param_info()

        if not self.param_info:
            raise ValueError(f"Unknown algorithm: {algorithm_name}")
        
        if params is None:
            self.params = self.get_default_params()
        else:
            self.params = self.validate_params(params)

    def get_default_params(self):
        default_params = {}
        for param, info in self.param_info.items():
            default_params[param] = info['default']
        return default_params
    
    def validate_params(self, params):
        validated_params = {}
        default_params = self.get_default_params()

        for param in default_params:
            if param in params:
                validated_params[param] = params[param]
            else:
                return default_params

        return validated_params
    
    def to_dict(self):
        return {
            'algorithm_name': self.algorithm_name,
            'params': self.params,
            'param_info': self.param_info
        }
    
    def get_algorithm_param_info(self):
        if self.algorithm_name == 'PCA':
            return {
                'n_components': {
                    'type': 'int',
                    'min': 1,
                    'max': self.shape[1],
                    'default': 2,
                    'description': 'The number of principal components to retain.',
                },
                'whiten': {
                    'type': 'boolean',
                    'default': False,
                    'description': 'If True, each principal component is scaled to have unit variance. Useful when the data will be used in further processing.',
                },
                'tol': {
                    'type': 'float',
                    'min': 0.0,
                    'default': 0.0,
                    'step': 0.1,
                    'precision': 1,
                    'description': 'The error tolerance for the "arpack" solver. This parameter is ignored if a different solver is used.'
                }
            }
        elif self.algorithm_name == 't-SNE':
            return {
                'n_components': {
                    'type': 'int',
                    'min': 2,
                    'max': 3,
                    'default': 2,
                    'description': 'The number of dimensions in the embedding space.',
                },
                'perplexity': {
                    'type': 'float',
                    'min': 5.0,
                    'max': self.shape[0] // 3,
                    'default': 30.0,
                    'step': 0.1,
                    'precision': 1,
                    'description': 'A balancing factor that determines the size of the local neighborhood.',
                },
                'learning_rate': {
                    'type': 'float',
                    'min': 10.0,
                    'max': 1000.0,
                    'default': 'auto',
                    'other': 'auto',
                    'step': 0.1,
                    'precision': 1,
                    'description': 'The rate at which the embedding is adjusted. "Auto" sets the learning rate to max(N / early_exaggeration, 200), where N is the number of samples.',
                },
                'angle': {
                    'type': 'float',
                    'min': 0.2,
                    'max': 1.0,
                    'default': 0.5,
                    'step': 0.1,
                    'precision': 1,
                    'description': 'Specifies the trade-off between speed and accuracy for the Barnes-Hut approximation. Lower values improve accuracy at the cost of slower computation.'
                },
                'max_iter': {
                    'type': 'int',
                    'min': 250,
                    'max': 5000,
                    'default': 1000,
                    'description': 'The maximum number of iterations for optimization.',
                },
                'init': {
                    'type': 'select',
                    'options': ['random', 'pca'],
                    'default': 'pca',
                    'description': 'The initialization method for the embedding. Choose "random" for random initialization or "pca" for principal component analysis-based initialization.',
                },
                'metric': {
                    'type': 'select',
                    'options': ['euclidean', 'manhattan', 'cosine', 'chebyshev', 'mahalanobis'],
                    'default': 'euclidean',
                    'description': 'The distance metric to use for measuring similarities in the high-dimensional space.',
                },
                'random_state': {
                    'type': 'int',
                    'min': 0,
                    'default': None,
                    'nullable': True,
                    'description': 'The seed for the random number generator to ensure reproducible results. None means randomness is not fixed.',
                },
            }
        elif self.algorithm_name == 'K-Means':
            return {
                'n_clusters': {
                    'type': 'int',
                    'min': 2,
                    'max': self.shape[0],
                    'default': 8,
                    'description': 'The number of clusters to form.',
                },
                'init': {
                    'type': 'select',
                    'options': ['k-means++', 'random'],
                    'default': 'k-means++',
                    'description': 'The method for initializing centroids. "k-means++" ensures faster convergence, while "random" selects initial centroids randomly.',
                },
                'n_init': {
                    'type': 'int',
                    'min': 1,
                    'max': 50,
                    'default': 'auto',
                    'other': 'auto',
                    'description': 'The number of independent runs of the algorithm to select the best solution. Set to "auto" for automatic selection.',
                },
                'max_iter': {
                    'type': 'int',
                    'min': 1,
                    'max': 1000,
                    'default': 300,
                    'description': 'The maximum number of iterations allowed per single run.',
                },
                'tol': {
                    'type': 'float',
                    'min': 0.0,
                    'max': 1.0,
                    'default': 0.0001,
                    'step': 0.0001,
                    'precision': 4,
                    'description': 'The relative tolerance with respect to inertia to declare convergence.',
                },
                'algorithm': {
                    'type': 'select',
                    'options': ['lloyd', 'elkan'],
                    'default': 'lloyd',
                    'description': 'The algorithm to use for computation. "lloyd" is the standard implementation, while "elkan" is faster for dense datasets with Euclidean distances.',
                }
            }
        elif self.algorithm_name == 'Agglomerative Clustering':
            return {
                'n_clusters': {
                    'type': 'int',
                    'min': 2,
                    'max': self.shape[0],
                    'default': 2,
                    'description': 'The number of clusters to form.',
                    'nullable': True,
                    'dependency': ['distance_threshold', 0.0, 'uncheck']
                },
                'metric': {
                    'type': 'select',
                    'options': ['euclidean', 'l1', 'l2', 'manhattan', 'cosine'],
                    'default': 'euclidean',
                    'description': 'The metric used to compute distances between samples.',
                    'dependency': ['linkage', 'ward']
                },
                'linkage': {
                    'type': 'select',
                    'options': ['ward', 'complete', 'average', 'single'],
                    'default': 'ward',
                    'description': 'Linkage criterion for merging clusters: "ward" minimizes intra-cluster variance (requires Euclidean distance), "complete" uses the maximum pairwise distance, "average" uses the mean pairwise distance, and "single" uses the minimum pairwise distance (nearest neighbor).',
                    'dependency': ['metric', 'ward', 'euclidean']
                },
                'distance_threshold': {
                    'type': 'float',
                    'min': 0.0,
                    'max': 100.0,
                    'default': None,
                    'step': 0.1,
                    'precision': 1,
                    'description': 'The maximum distance between clusters for them to be merged.',
                    'nullable': True,
                    'dependency': ['n_clusters', 2, 'uncheck']
                }
            }
        elif self.algorithm_name == 'DBSCAN':
            return {
                'eps': {
                    'type': 'float',
                    'min': 0.1,
                    'max': 10.0,
                    'default': 0.5,
                    'step': 0.1,
                    'precision': 1,
                    'description': 'The maximum distance between two samples for them to be considered as neighbors. Smaller values result in more clusters.',
                },
                'min_samples': {
                    'type': 'int',
                    'min': 1,
                    'max': 50,
                    'default': 5,
                    'description': 'The number of samples (or total weight) in a neighborhood for a point to be considered as a core point. Higher values lead to fewer clusters.',
                },
                'metric': {
                    'type': 'select',
                    'options': ['euclidean', 'manhattan', 'cosine', 'chebyshev'],
                    'default': 'euclidean',
                    'description': 'The distance metric used to define the neighborhood.',
                },
                'algorithm': {
                    'type': 'select',
                    'options': ['auto', 'ball_tree', 'kd_tree', 'brute'],
                    'default': 'auto',
                    'description': 'The algorithm used for nearest neighbors search. "auto" chooses the best option based on data, while "ball_tree", "kd_tree", and "brute" can be manually specified for different data distributions.',
                }
            }
        elif self.algorithm_name == 'KNN':
            return {
                'n_neighbors': {
                    'type': 'int',
                    'min': 1,
                    'max': self.shape[0],
                    'default': 5,
                    'description': 'The number of neighbors to use for classification.',
                },
                'weights': {
                    'type': 'select',
                    'options': ['uniform', 'distance'],
                    'default': 'uniform',
                    'description': 'Weighting function for neighbors: "uniform" assigns equal weight to all neighbors, while "distance" assigns weights inversely proportional to their distance.',
                },
                'algorithm': {
                    'type': 'select',
                    'options': ['auto', 'ball_tree', 'kd_tree', 'brute'],
                    'default': 'auto',
                    'description': 'Algorithm used to find the nearest neighbors: "auto" selects the best algorithm based on the data, "ball_tree" and "kd_tree" are tree-based methods, and "brute" performs an exhaustive search.',
                },
                'metric': {
                    'type': 'select',
                    'options': ['euclidean', 'manhattan', 'cosine', 'chebyshev'],
                    'default': 'euclidean',
                    'description': 'Distance metric used to compute similarity.',
                },
                'test_size': {
                    'type': 'float',
                    'min': 0.01,
                    'max': 0.5,
                    'default': 0.25,
                    'step': 0.01,
                    'precision': 2,
                    'description': 'The proportion of the dataset to include in the test split.',
                },
            }
        elif self.algorithm_name == 'Decision Tree':
            return {
                'criterion': {
                    'type': 'select',
                    'options': ['gini', 'entropy', 'log_loss'],
                    'default': 'gini',
                    'description': 'Split criterion for decision making. "gini" minimizes the Gini impurity, "entropy" minimizes the information gain, and "log_loss" uses logistic regression loss for probabilistic splits.',
                },
                'max_depth': {
                    'type': 'int',
                    'min': 1,
                    'max': 100,
                    'default': None,
                    'description': 'The maximum depth of the tree. If None, the tree grows until all leaves are pure or until all leaves contain less than min_samples_split samples.',
                    'nullable': True
                },
                'min_samples_split': {
                    'type': 'int',
                    'min': 2,
                    'max': 100,
                    'default': 2,
                    'description': 'The minimum number of samples required to split an internal node. Higher values restrict tree growth and reduce overfitting.',
                },
                'min_samples_leaf': {
                    'type': 'int',
                    'min': 1,
                    'max': 50,
                    'default': 1,
                    'description': 'The minimum number of samples required to be at a leaf node. Higher values lead to smoother decision boundaries.',
                },
                'random_state': {
                    'type': 'int',
                    'min': 0,
                    'default': None,
                    'description': 'Controls the randomness of the estimator. Setting this parameter allows reproducibility of results.',
                    'nullable': True
                },
                'test_size': {
                    'type': 'float',
                    'min': 0.01,
                    'max': 0.5,
                    'default': 0.25,
                    'step': 0.01,
                    'precision': 2,
                    'description': 'The proportion of the dataset to include in the test split.',
                },
            }
        elif self.algorithm_name == 'SVM':
            return {
                'C': {
                    'type': 'float',
                    'min': 0.01,
                    'default': 1.0,
                    'step': 0.01,
                    'precision': 2,
                    'description': 'Regularization parameter. Smaller values increase regularization, making the model simpler. Larger values reduce regularization, allowing the model to fit the data more closely.',
                },
                'kernel': {
                    'type': 'select',
                    'options': ['linear', 'poly', 'rbf', 'sigmoid'],
                    'default': 'rbf',
                    'description': 'Specifies the kernel type to be used in the algorithm: "linear" for linear decision boundaries, "poly" for polynomial decision boundaries, "rbf" (default) for non-linear decision boundaries, and "sigmoid" for sigmoid-shaped decision boundaries.',
                },
                'gamma': {
                    'type': 'select',
                    'options': ['scale', 'auto'],
                    'default': 'scale',
                    'description': 'Kernel coefficient for rbf, poly, and sigmoid kernels: "scale" (default) uses 1 / (n_features * X.var()), while "auto" uses 1 / n_features.',
                },
                'degree': {
                    'type': 'int',
                    'min': 2,
                    'max': 10,
                    'default': 3,
                    'description': 'Degree of the polynomial kernel function (only used for poly kernel).',
                    'dependency': ['kernel', 'poly', 'enable']
                },
                'max_iter': {
                    'type': 'int',
                    'min': -1,
                    'default': -1,
                    'description': 'Hard limit on iterations within solver. Default is -1, meaning no limit. Set this to a positive value to control training time for large datasets.',
                },
                'test_size': {
                    'type': 'float',
                    'min': 0.01,
                    'max': 0.5,
                    'default': 0.25,
                    'step': 0.01,
                    'precision': 2,
                    'description': 'The proportion of the dataset to include in the test split.',
                },
            }
        else:
            return {}
