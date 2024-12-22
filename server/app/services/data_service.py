from sklearn.datasets import (
    load_iris, 
    load_digits, 
    load_wine, 
    load_breast_cancer, 
    fetch_california_housing, 
    load_diabetes
)
import pandas as pd

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
    df['target'] = dataset.target

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