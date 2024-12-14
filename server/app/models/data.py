import pandas as pd
import numpy as np

class Data:
    data = None
    columnTypes = None

    @staticmethod
    def set_data(new_data):
        Data.data = new_data

    @staticmethod
    def get_data():
        return Data.data
    
    @staticmethod
    def set_columnTypes(new_columnTypes):
        Data.columnTypes = new_columnTypes

    @staticmethod
    def get_columnTypes():
        return Data.columnTypes

    @staticmethod
    def read_data(file):
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file)
            
        elif file.filename.endswith('.xls') or file.filename.endswith('.xlsx'):
            df = pd.read_excel(file)

        return df
    

    @staticmethod
    def validate_data(df):
        if df.dropna().shape[0] >= 10:
            return 1
        else:
            return 0


    @staticmethod
    def map_data_id(df):
        columnsNames = list(df.columns)
        df.columns = map(str.lower, df.columns)
        print(columnsNames)
        if "id" not in df.columns:
            df.insert(0, "id", range(1, len(df)+1))
        else:
            expected_ids = set(range(1, len(df) + 1))  # Zbiór oczekiwanych wartości
            actual_ids = set(df["id"].dropna().astype(int))
            if actual_ids != expected_ids:
                df["id"] = range(1, len(df) + 1)
        return df
    
    @staticmethod
    def complex_to_real(value):
        if isinstance(value, complex):
            return value.real
        return value
    
    @staticmethod
    def unify_types(df):
        for item in Data.columnTypes:
            col = item["column"]
            col_type = item["type"]
            if col_type in ["nominal", "categorical"]:
                # Konwersja na string
                df[col] = df[col].astype(str)
            elif col_type == "numerical":
                # Konwersja na float i obsługa liczb zespolonych
                df[col] = df[col].apply(Data.complex_to_real).astype(float)
            df = df.replace({np.nan: None})
        return df
    
    @staticmethod
    def analyze_null_values(df):
        # #procent nullów w kolumnach
        # print(df.isnull().mean() * 100)
        # #procent wierszy z nullami
        # rows_with_null = df.isnull().any(axis=1).sum()
        # print(f"Liczba wierszy z brakami: {rows_with_null}")
        # total_rows = len(df)
        # print(f"Procent wierszy z brakami: {rows_with_null / total_rows * 100:.2f}%")
        result = {}
        for column in df.columns:
            null_count = df[column].isna().sum()  # Liczymy liczbę wartości NaN w kolumnie
            result[column] = null_count
        return result
    
    @staticmethod
    def analyze_unique_values(df):
        result = {}
        for column in df.columns:
            unique_values_count = df[column].nunique()  # Liczymy liczbę wartości NaN w kolumnie
            result[column] = unique_values_count if 2 <= unique_values_count <= 10 else 0
        return result


    

    
