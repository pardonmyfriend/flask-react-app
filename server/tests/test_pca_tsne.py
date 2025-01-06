import pytest
import time
import pandas as pd
from sklearn.datasets import load_iris, load_breast_cancer, load_digits, load_wine, load_diabetes, fetch_california_housing
from app.services.algorithms_service import run_pca_service, run_tsne_service

@pytest.fixture
def sample_data():
    # Przygotowanie przykładowego DataFrame
    iris = fetch_california_housing()
    df = pd.DataFrame(iris.data, columns=iris.feature_names)
    df['target'] = iris.target
    return df

def test_run_pca_service(sample_data):
    params = {'n_components': 2, 'whiten': False, 'tol': 0.0}
    result = run_pca_service(sample_data, params, target='target')
    
    # Sprawdzanie, czy wynik zawiera odpowiednie klucze
    assert "pca_dataframe" in result
    
    pca_df = pd.DataFrame(result["pca_dataframe"])
    assert len(pca_df) == len(sample_data)  # Taka sama liczba wierszy
    
    # Sprawdzanie obecności odpowiednich kolumn
    expected_columns = ['PC1', 'PC2', 'id', 'target']
    for col in expected_columns:
        assert col in pca_df.columns

def test_run_tsne_service(sample_data):
    params = {
        'n_components': 2,
        'perplexity': 30.0,
        'learning_rate': 200.0,
        'max_iter': 1000,
        'init': 'random',
        'metric': 'euclidean',
        'angle': 0.5,
        'random_state': 42
    }
    result = run_tsne_service(sample_data, params, target='target')
    
    # Sprawdzanie, czy wynik zawiera odpowiednie klucze
    assert "tsne_dataframe" in result
    
    tsne_df = pd.DataFrame(result["tsne_dataframe"])
    assert len(tsne_df) == len(sample_data)  # Taka sama liczba wierszy
    
    # Sprawdzanie obecności odpowiednich kolumn
    expected_columns = ['F1', 'F2', 'id', 'target']
    for col in expected_columns:
        assert col in tsne_df.columns

def test_pca_vs_tsne_execution_time(sample_data):
    pca_params = {'n_components': 2, 'whiten': False, 'tol': 0.0}
    tsne_params = {
        'n_components': 2,
        'perplexity': 30.0,
        'learning_rate': 200.0,
        'max_iter': 1000,
        'init': 'random',
        'metric': 'euclidean',
        'angle': 0.5,
        'random_state': 42
    }
    
    # Mierzenie czasu działania PCA
    start_time_pca = time.time()
    run_pca_service(sample_data, pca_params, target='target')
    pca_time = time.time() - start_time_pca
    
    # Mierzenie czasu działania t-SNE
    start_time_tsne = time.time()
    run_tsne_service(sample_data, tsne_params, target='target')
    tsne_time = time.time() - start_time_tsne

    print(f"\nPCA execution time: {pca_time:.4f} seconds")
    print(f"t-SNE execution time: {tsne_time:.4f} seconds")
    
    # Porównanie czasów wykonania (opcjonalne, zależnie od celu testu)
    assert pca_time < tsne_time * 2, "PCA powinno być szybsze niż t-SNE (z reguły)"
