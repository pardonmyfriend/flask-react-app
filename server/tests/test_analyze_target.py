import pytest
import pandas as pd
from app.services.data_service import analyze_target

@pytest.fixture
def sample_data():
    return pd.DataFrame({
        "numeric_col_1": [1, 2, 3, 4, 5],
        "numeric_col_2": [1.1, 2.2, 3.3, 4.4, 5.5],
        "category_col": ["A", "B", "A", "B", "C"],
        "target_col": [1, 0, 1, 0, 1]
    })

def test_analyze_target(sample_data):
    target_analysis = analyze_target(sample_data, "target_col")
    assert target_analysis == {1: 3, 0: 2}
