from sklearn.datasets import (
    load_iris, 
    load_digits, 
    load_wine, 
    load_breast_cancer, 
)
import pandas as pd
import numpy as np
import os
from itertools import combinations
from scipy.stats import kstest

from app.models.data import Data

types_dict = {
    'int64' : "numerical",
    'float64' : "numerical",
    'complex128' : "numerical",
    'object' : "nominal",
    'string' : "nominal",
    'datetime' : "nominal",
    'timedelta' : "nominal",
    'period' : "nominal",
    'boolean' : "categorical",
    'category' : "categorical"
}

def load_dataset_by_name(name):
    if name == "iris":
        return load_iris(as_frame=True)
    if name == "digits":
        return load_digits(as_frame=True)
    elif name == "wine":
        return load_wine(as_frame=True)
    elif name == "breast_cancer":
        return load_breast_cancer(as_frame=True)
    elif name == "air_quality":
        file_path = os.path.join(os.path.dirname(__file__), 'datasets', 'air_quality_dataset.csv')
        df = pd.read_csv(file_path)
        df.rename(columns={'Air Quality': 'target'}, inplace=True)
        df['id'] = range(1, len(df) + 1)
        return df
    elif name == "cancer":
        file_path = os.path.join(os.path.dirname(__file__), 'datasets', 'cancer_dataset.csv')
        df = pd.read_csv(file_path)
        df.rename(columns={'diagnosis': 'target'}, inplace=True)
        df['id'] = range(1, len(df) + 1)
        return df
    elif name == "weather_forecast":
        file_path = os.path.join(os.path.dirname(__file__), 'datasets', 'weather_forecast_dataset.csv')
        df = pd.read_csv(file_path)
        df.rename(columns={'Rain': 'target'}, inplace=True)
        df['id'] = range(1, len(df) + 1)
        return df
    else:
        return None
    
def load_dataset_service(name):
    dataset = load_dataset_by_name(name)

    if name == "air_quality" or name == "cancer" or name == "weather_forecast":
        df = dataset
    else:
        df = pd.DataFrame(dataset.data, columns=dataset.feature_names)
        df['target'] = pd.Categorical.from_codes(dataset.target, dataset.target_names)

    df = Data.map_data_id(df)
    Data.set_data(df)
    dat = Data.get_data()

    nullValuesAnalysis = Data.analyze_null_values(df)
    uniqueValuesAnalysis = Data.analyze_unique_values(df)
    uniqueValuesList = Data.unique_values_to_list(df)
    columnTypesList = [{"column": col, "type": str(dtype)} for col, dtype in df.dtypes.items()]
    mappedColumnTypes = [
        {
            "column": item["column"], 
            "type": types_dict.get(item["type"], "nominal"),
            "class": 'true' if item["column"] == 'target' else 'false',
            "handleNullValues": 'Ignore',
            "nullCount": int(nullValuesAnalysis.get(item["column"], 0)),
            "uniqueValuesCount": int(uniqueValuesAnalysis.get(item["column"], 0)),
            "uniqueValues": uniqueValuesList.get(item["column"], []),
            "valueToFillWith": uniqueValuesList.get(item["column"], [])[0] if uniqueValuesList.get(item["column"], []) else None
        }
        for item in columnTypesList
    ]
    Data.set_columnTypes(mappedColumnTypes)
    # print("columnTypes:", Data.get_columnTypes())
    df = Data.unify_types(df)
    data = df.to_dict(orient='records')

    return {
        "data": data,
        "types": mappedColumnTypes,
        "target": "target",
    }

def get_basic_stats(df):
    stats = df.describe().T
    stats["data_type"] = df.dtypes.astype(str)
    return stats.reset_index().to_dict(orient='records')

def analyze_target(df, target_column):
    return df[target_column].value_counts().to_dict()

def get_correlation_matrix(df):
    corr = df.select_dtypes(include=[np.number]).corr()
    return corr.round(2).to_dict()

def get_data_for_box_plot(df):
    numeric_df = df.select_dtypes(include='number').dropna()
    return numeric_df.to_dict(orient='records')

def calculate_histograms(data):
    histograms = {}
    for column in data.select_dtypes(include=[np.number]).columns:
        histograms[column] = data[column].dropna().tolist()
    return histograms

def analyze_categorical_features(data, target=None):
    categorical_analysis = {}
    for column in data.select_dtypes(include=['object', 'category']).columns:
        if column == target:
            continue
        
        unique_values = data[column].nunique()
        
        if unique_values <= 10:
            counts = data[column].value_counts()
            categorical_analysis[column] = {
                'labels': counts.index.tolist(),
                'values': counts.values.tolist()
            }
    return categorical_analysis

def kolmogorov_smirnov_test(data):
    ks_results = {}
    for column in data.select_dtypes(include=[np.number]).columns:
        result = kstest(data[column].dropna(), 'norm')
        ks_results[column] = {
            'statistic': result.statistic,
            'p_value': result.pvalue
        }
    return ks_results

def calculate_skewness_and_kurtosis(data):
    stats = {}
    for column in data.select_dtypes(include=[np.number]).columns:
        stats[column] = {
            'skewness': data[column].skew(),
            'kurtosis': data[column].kurtosis()
        }
    return stats