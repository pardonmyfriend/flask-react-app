class Algorithm:
    def __init__(self, algorithm_name, params=None):
        self.algorithm_name = algorithm_name
        self.param_info = self.get_algorithm_param_info()

        if not self.param_info:
            raise ValueError(f"Unknown algorithm: {algorithm_name}")
        
        if params is None:
            self.params = self.get_default_params()
        else:
            self.params = params

    def get_default_params(self):
        default_params = {}
        for param, info in self.param_info.items():
            default_params[param] = info['default']
        return default_params
    
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
                    'max': 10,
                    'default': 2,
                    'description': 'Number of principal components to retain', 
                },
                'whiten': {
                    'type': 'boolean',
                    'default': False,
                    'description': 'Applies normalization to each component',
                },
                'svd_solver': {
                    'type': 'select',
                    'options': ['auto', 'full', 'arpack', 'randomized'],
                    'default': 'auto',
                    'description': 'Method for performing SVD in dimensionality reduction',
                },
                'tol': {
                    'type': 'float',
                    'min': 0.0,
                    'max': 1.0,
                    'default': 0.0,
                    'step': 0.1,
                    'precision': 1,
                    'description': 'Error tolerance for "arpack" solver',
                    'dependency': ['svd_solver', 'arpack', 'enable']
                }
            }
        elif self.algorithm_name == 't-SNE':
            return {
                'n_components': {
                    'type': 'int',
                    'min': 2,
                    'max': 3,
                    'default': 2,
                    'description': 'Target dimensionality for embedding',
                },
                'perplexity': {
                    'type': 'float',
                    'min': 5.0,
                    'max': 50.0,
                    'default': 30.0,
                    'step': 0.1,
                    'precision': 1,
                    'description': 'Balancing factor for neighborhood size',
                },
                'learning_rate': {
                    'type': 'float',
                    'min': 10.0,
                    'max': 1000.0,
                    'default': 200.0,
                    'step': 0.1,
                    'precision': 1,
                    'description': 'Rate at which embedding is adjusted',
                },
                'max_iter': {
                    'type': 'int',
                    'min': 250,
                    'max': 5000,
                    'default': 1000,
                    'description': 'Number of optimization steps',
                },
                'init': {
                    'type': 'select',
                    'options': ['random', 'pca'],
                    'default': 'pca',
                    'description': 'Initial point configuration for embedding',
                },
                'metric': {
                    'type': 'select',
                    'options': ['euclidean', 'manhattan', 'cosine'],
                    'default': 'euclidean',
                    'description': 'Distance measure for embedding space',
                }
            }
        elif self.algorithm_name == 'K-Means':
            return {
                'n_clusters': {
                    'type': 'int',
                    'min': 2,
                    'max': 20,
                    'default': 8,
                    'description': 'Number of clusters to form in data',
                },
                'init': {
                    'type': 'select',
                    'options': ['k-means++', 'random'],
                    'default': 'k-means++',
                    'description': 'Centroid initialization method',
                },
                'n_init': {
                    'type': 'int',
                    'min': 1,
                    'max': 50,
                    'default': 10,
                    'description': 'Independent runs to pick best inertia',
                },
                'max_iter': {
                    'type': 'int',
                    'min': 1,
                    'max': 1000,
                    'default': 300,
                    'description': 'Max steps allowed per run',
                },
                'tol': {
                    'type': 'float',
                    'min': 0.0,
                    'max': 1.0,
                    'default': 0.0001,
                    'step': 0.0001,
                    'precision': 4,
                    'description': 'Tolerance to declare convergence',
                },
                'algorithm': {
                    'type': 'select',
                    'options': ['lloyd', 'elkan'],
                    'default': 'lloyd',
                    'description': 'Algorithm used for computation',
                }
            }
        elif self.algorithm_name == 'Agglomerative Clustering':
            return {
                'n_clusters': {
                    'type': 'int',
                    'min': 2,
                    'max': 20,
                    'default': 2,
                    'description': 'Number of clusters to form',
                    'nullable': True,
                    'dependency': ['distance_threshold', 0.0, 'uncheck']
                },
                'affinity': {
                    'type': 'select',
                    'options': ['euclidean', 'manhattan', 'cosine'],
                    'default': 'euclidean',
                    'description': 'Distance metric for clustering',
                },
                'linkage': {
                    'type': 'select',
                    'options': ['ward', 'complete', 'average', 'single'],
                    'default': 'ward',
                    'description': 'Method for merging clusters',
                },
                'distance_threshold': {
                    'type': 'float',
                    'min': 0.0,
                    'max': 100.0,
                    'default': None,
                    'step': 0.1,
                    'precision': 1,
                    'description': 'Max distance between clusters to merge',
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
                    'description': 'Max distance for neighboring points',
                },
                'min_samples': {
                    'type': 'int',
                    'min': 1,
                    'max': 50,
                    'default': 5,
                    'description': 'Points required to form a cluster',
                },
                'metric': {
                    'type': 'select',
                    'options': ['euclidean', 'manhattan', 'cosine'],
                    'default': 'euclidean',
                    'description': 'Distance metric for neighbors',
                },
                'algorithm': {
                    'type': 'select',
                    'options': ['auto', 'ball_tree', 'kd_tree', 'brute'],
                    'default': 'auto',
                    'description': 'Algorithm for nearest neighbors search',
                }
            }
        elif self.algorithm_name == 'KNN':
            return {
                'n_neighbors': {
                    'type': 'int',
                    'min': 1,
                    'max': 20,
                    'default': 5,
                    'description': 'Number of neighbors to use in classification',
                },
                'weights': {
                    'type': 'select',
                    'options': ['uniform', 'distance'],
                    'default': 'uniform',
                    'description': 'Weighting function for neighbors',
                },
                'algorithm': {
                    'type': 'select',
                    'options': ['auto', 'ball_tree', 'kd_tree', 'brute'],
                    'default': 'auto',
                    'description': 'Method for finding nearest neighbors',
                },
                'metric': {
                    'type': 'select',
                    'options': ['euclidean', 'manhattan', 'cosine'],
                    'default': 'euclidean',
                    'description': 'Distance metric to use',
                },
                'p': {
                    'type': 'int',
                    'min': 1,
                    'max': 5,
                    'default': 2,
                    'description': 'Power parameter for Minkowski metric',
                }
            }
        elif self.algorithm_name == 'Decision Tree':
            return {
                'criterion': {
                    'type': 'select',
                    'options': ['gini', 'entropy'],
                    'default': 'gini',
                    'description': 'Split criterion for decision making',
                },
                'max_depth': {
                    'type': 'int',
                    'min': 1,
                    'max': 100,
                    'default': None,
                    'description': 'Maximum depth of the tree',
                    'nullable': True
                },
                'min_samples_split': {
                    'type': 'int',
                    'min': 2,
                    'max': 100,
                    'default': 2,
                    'description': 'Minimum samples needed to split a node',
                },
                'min_samples_leaf': {
                    'type': 'int',
                    'min': 1,
                    'max': 50,
                    'default': 1,
                    'description': 'Minimum samples needed at a leaf node',
                },
                'max_features': {
                    'type': 'select',
                    'options': ['auto', 'sqrt', 'log2', None],
                    'default': None,
                    'description': 'Max features considered per split',
                    'nullable': True
                },
                'random_state': {
                    'type': 'int',
                    'default': None,
                    'description': 'Sets random seed for reproducibility',
                    'nullable': True
                }
            }
        elif self.algorithm_name == 'Logistic Regression':
            return {
                'fit_intercept': {
                    'type': 'boolean',
                    'default': True,
                    'description': 'Calculates the intercept in the model',
                },
                'normalize': {
                    'type': 'boolean',
                    'default': False,
                    'description': 'Normalizes features before regression',
                },
                'n_jobs': {
                    'type': 'int',
                    'default': None,
                    'description': 'Number of jobs to run in parallel',
                    'nullable': True
                }
            }
        else:
            return {}
