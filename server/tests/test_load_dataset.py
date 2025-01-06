# import pytest
# from unittest import mock
# from app import create_app

# @pytest.fixture
# def client():
#     app = create_app()
#     app.config['TESTING'] = True
#     with app.test_client() as client:
#         yield client

# @mock.patch('app.controllers.data_controller.load_dataset_service')  # Mock funkci serwisowej
# def test_load_dataset_success(mock_service, client):
#     # Przygotowanie fałszywej odpowiedzi serwisu
#     mock_service.return_value = {
#         "data": [
#             {"sepal length (cm)": 5.1, "sepal width (cm)": 3.5, "petal length (cm)": 1.4, "petal width (cm)": 0.2, "target": "setosa"},
#             {"sepal length (cm)": 4.9, "sepal width (cm)": 3.0, "petal length (cm)": 1.4, "petal width (cm)": 0.2, "target": "setosa"},
#         ]
#     }
    
#     # Wysłanie żądania do endpointu
#     response = client.post('/data/load_dataset/iris')
    
#     # Assercje
#     assert response.status_code == 200
#     assert response.json == {
#         "data": [
#             {"sepal length (cm)": 5.1, "sepal width (cm)": 3.5, "petal length (cm)": 1.4, "petal width (cm)": 0.2, "target": "setosa"},
#             {"sepal length (cm)": 4.9, "sepal width (cm)": 3.0, "petal length (cm)": 1.4, "petal width (cm)": 0.2, "target": "setosa"},
#         ]
#     }
#     mock_service.assert_called_once_with("iris")

# @mock.patch('app.controllers.data_controller.load_dataset_service')
# def test_load_dataset_failure(mock_service, client):
#     # Symulowanie rzucenia wyjątku ValueError
#     mock_service.side_effect = ValueError("Unknown dataset: unknown_dataset")
    
#     # Wysłanie żądania do endpointu
#     response = client.post('/data/load_dataset/unknown_dataset')

#     # Debugowanie odpowiedzi
#     print("Response status code:", response.status_code)
#     print("Response JSON:", response.json)
    
#     # Asercje
#     assert response.status_code == 400
#     assert response.json == {"error": "Unknown dataset: unknown_dataset"}
#     mock_service.assert_called_once_with("unknown_dataset")

