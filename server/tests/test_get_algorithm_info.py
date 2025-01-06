# import pytest
# from unittest import mock
# from app import create_app

# @pytest.fixture
# def client():
#     app = create_app()
#     app.config['TESTING'] = True
#     with app.test_client() as client:
#         yield client

# @mock.patch('app.controllers.algorithms_controller.get_algorithm_info_service')  # Zamockowanie serwisu
# def test_get_algorithm_info_success(mock_service, client):
#     # Przygotowanie zamockowanej odpowiedzi
#     mock_service.return_value = {
#         "algorithm": {
#             "algorithm_name": "PCA",
#             "params": {
#                 "n_components": 2,
#                 "whiten": False,
#                 "tol": 0.0
#             },
#             "param_info": {
#                 "n_components": {
#                     "type": "int",
#                     "min": 1,
#                     "max": 10,
#                     "default": 2,
#                     "description": "The number of principal components to retain."
#                 }
#             }
#         }
#     }

#     # Dane wejściowe do żądania
#     request_data = {
#         "algorithm": "PCA",
#         "params": {"n_components": 2},
#         "data": [{"id": 1, "feature1": 2.0, "feature2": 3.0}],
#         "target": "feature1"
#     }

#     # Wysłanie żądania POST
#     response = client.post('/algorithms/get_algorithm_info', json=request_data)

#     # Asercje
#     assert response.status_code == 200
#     assert response.json == {
#         "algorithm": {
#             "algorithm_name": "PCA",
#             "params": {
#                 "n_components": 2,
#                 "whiten": False,
#                 "tol": 0.0
#             },
#             "param_info": {
#                 "n_components": {
#                     "type": "int",
#                     "min": 1,
#                     "max": 10,
#                     "default": 2,
#                     "description": "The number of principal components to retain."
#                 }
#             }
#         }
#     }
#     mock_service.assert_called_once_with("PCA", {"n_components": 2}, [{"id": 1, "feature1": 2.0, "feature2": 3.0}], "feature1")

# @mock.patch('app.controllers.algorithms_controller.get_algorithm_info_service')
# def test_get_algorithm_info_unknown_algorithm(mock_service, client):
#     # Symulowanie wyjątku ValueError
#     mock_service.side_effect = ValueError("Unknown algorithm: XYZ")

#     # Dane wejściowe do żądania
#     request_data = {
#         "algorithm": "XYZ",
#         "params": {"n_components": 2},
#         "data": [{"id": 1, "feature1": 2.0, "feature2": 3.0}],
#         "target": "feature1"
#     }

#     # Wysłanie żądania POST
#     response = client.post('/algorithms/get_algorithm_info', json=request_data)

#     # Asercje
#     assert response.status_code == 400
#     assert response.json == {"error": "Unknown algorithm: XYZ"}
#     mock_service.assert_called_once_with("XYZ", {"n_components": 2}, [{"id": 1, "feature1": 2.0, "feature2": 3.0}], "feature1")

