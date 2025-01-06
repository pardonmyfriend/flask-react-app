import pytest
import pandas as pd
from app.services.data_service import get_basic_stats

@pytest.fixture
def sample_data():
    return pd.DataFrame({
        "numeric_col_1": [1, 2, 3, 4, 5],
        "numeric_col_2": [1.1, 2.2, 3.3, 4.4, 5.5],
        "category_col": ["A", "B", "A", "B", "C"],
        "target_col": [1, 0, 1, 0, 1]
    })

def test_get_basic_stats(sample_data):
    stats = get_basic_stats(sample_data)
    assert isinstance(stats, list)
    assert len(stats) == 3
    for record in stats:
        assert "data_type" in record
