class Algorithm:
    def __init__(self, algorithm_name, params=None):
        self.algorithm_name = algorithm_name
        self.param_info = self.get_algorithm_param_info()

        if not self.param_info:
            raise ValueError(f"Nieznany algorytm: {algorithm_name}")
        
        if params is None:
            self.params = self.get_default_params()
        else:
            self.params = params
    
    def get_algorithm_param_info(self):
        if self.algorithm_name == 'PCA':
            return {
                'n_components': {
                    'type': 'int',
                    'min': 1,
                    'max': 10,
                    'default': 2
                },
                'whiten': {
                    'type': 'boolean',
                    'default': False
                }
            }
        else:
            return {}

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