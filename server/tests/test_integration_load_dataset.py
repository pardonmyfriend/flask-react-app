import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_load_dataset_valid(client):
    response = client.post('/data/load_dataset/iris')
    assert response.status_code == 200

    data = response.get_json()

    # Sprawdzenie kluczowych elementów odpowiedzi
    assert "data" in data
    assert "types" in data
    assert "target" in data

    # Sprawdzenie struktury "data"
    first_row = data["data"][0]
    assert isinstance(first_row, dict)
    assert "id" in first_row  # Powinna być kolumna `id`
    assert "target" in first_row

    # Sprawdzenie "types"
    types = data["types"]
    assert isinstance(types, list)
    for col in types:
        assert "column" in col
        assert "type" in col
        assert "nullCount" in col
        assert "uniqueValuesCount" in col
