from sklearn.datasets import (
    load_iris, 
    load_digits, 
    load_wine, 
    load_breast_cancer, 
    fetch_california_housing, 
    load_diabetes
)
import pandas as pd
import numpy as np

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
    elif name == "digits":
        return load_digits(as_frame=True)
    elif name == "wine":
        return load_wine(as_frame=True)
    elif name == "breast_cancer":
        return load_breast_cancer(as_frame=True)
    elif name == "california_housing":
        return fetch_california_housing(as_frame=True)
    elif name == "diabetes":
        return load_diabetes(as_frame=True)
    else:
        return None
    
def load_dataset_service(name):
    dataset = load_dataset_by_name(name)
    
    df = pd.DataFrame(dataset.data, columns=dataset.feature_names)
    df['target'] = pd.Categorical.from_codes(dataset.target, dataset.target_names)

    df = Data.map_data_id(df)

    nullValuesAnalysis = Data.analyze_null_values(df)
    uniqueValuesAnalysis = Data.analyze_unique_values(df)
    columnTypesList = [{"column": col, "type": str(dtype)} for col, dtype in df.dtypes.items()]
    mappedColumnTypes = [
        {
            "column": item["column"], 
            "type": types_dict.get(item["type"], "nominal"),
            "class": 'false',
            "nullCount": int(nullValuesAnalysis.get(item["column"], 0)),
            "uniqueValues": int(uniqueValuesAnalysis.get(item["column"], 0))
        }
        for item in columnTypesList
    ]
    Data.set_columnTypes(mappedColumnTypes)
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
    print(df[target_column].value_counts().to_dict())
    return df[target_column].value_counts().to_dict()
    # print("analyze_target")
    # if target_column not in df.columns:
    #     return {"error": "Target column not found."}
    # if pd.api.types.is_numeric_dtype(df[target_column]):
    #     return df[target_column].describe().to_dict()
    # else:
    #     return df[target_column].value_counts().to_dict()

def get_correlation_matrix(df):
    print("get_correlation_matrix")
    corr = df.select_dtypes(include=[np.number]).corr()
    return corr.round(2).to_dict()

def get_missing_data(df):
    print("get_missing_data")
    missing = df.isnull().sum() / len(df) * 100
    return missing[missing > 0].round(2).to_dict()

def get_distributions(df):
    print("get_distributions")
    distributions = {}
    for column in df.select_dtypes(include=[np.number]).columns:
        distributions[column] = {
            "histogram": df[column].dropna().value_counts(bins=10).to_dict()
        }
    return distributions