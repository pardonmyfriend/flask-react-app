import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_get_algorithm_info(client):
    # Dane wejściowe do żądania
    request_data = {
        "algorithm": "PCA",
        "params": {"n_components": 2},
        "data": [
            {"id": 1, "feature1": 5.1, "feature2": 3.5, "feature3": 1.4},
            {"id": 2, "feature1": 4.9, "feature2": 3.0, "feature3": 1.4}
        ],
        "target": "feature1"
    }

    # Wysłanie żądania POST
    response = client.post('/algorithms/get_algorithm_info', json=request_data)

    # Asercje dla odpowiedzi
    assert response.status_code == 200
    response_data = response.json

    assert "algorithm" in response_data
    assert response_data["algorithm"]["algorithm_name"] == "PCA"
    assert response_data["algorithm"]["params"] == {
        "n_components": 2,
        "whiten": False,
        "tol": 0.0
    }
    assert "param_info" in response_data["algorithm"]
    assert "n_components" in response_data["algorithm"]["param_info"]

def test_get_algorithm_info_invalid_algorithm(client):
    # Dane wejściowe dla nieznanego algorytmu
    request_data = {
        "algorithm": "XYZ",  # Nieistniejący algorytm
        "params": {"n_components": 2},
        "data": [
            {"id": 1, "feature1": 5.1, "feature2": 3.5, "feature3": 1.4},
            {"id": 2, "feature1": 4.9, "feature2": 3.0, "feature3": 1.4}
        ],
        "target": "feature1"
    }

    # Wysłanie żądania POST
    response = client.post('/algorithms/get_algorithm_info', json=request_data)

    # Asercje dla błędnej odpowiedzi
    assert response.status_code == 400
    assert response.json == {"error": "Unknown algorithm: XYZ"}
