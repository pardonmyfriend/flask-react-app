import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.preprocessing import StandardScaler

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
                df[col] = df[col].astype(str)
            elif col_type == "numerical":
                df[col] = df[col].apply(Data.complex_to_real).astype(float)
            df = df.replace({np.nan: None})
        return df
    
    @staticmethod
    def analyze_null_values(df):
        result = {}
        for column in df.columns:
            null_count = df[column].isna().sum()  
            result[column] = null_count
        return result
    
    @staticmethod
    def analyze_unique_values(df):
        result = {}
        for column in df.columns:
            unique_values_count = df[column].nunique()  
            result[column] = unique_values_count if 2 <= unique_values_count <= 10 else 0
        return result
    
    @staticmethod
    def unique_values_to_list(df):
        result = {
        col: df[col].unique().tolist() 
        for col in df.columns 
        if 2 <= len(df[col].unique()) <= 10
        }
        for key, values in result.items():
            result[key] = [value for value in values if not pd.isna(value)]
        return result
    
    @staticmethod
    def updateColumnTypes():
        data = Data.get_data().copy()
        columnTypes = Data.get_columnTypes().copy()
        
        if not isinstance(columnTypes, pd.DataFrame):
            columnTypes = pd.DataFrame(columnTypes)
    
        columns = set(data.columns)
        columnTypesColumns = set(columnTypes['column'])
        
        if columns != columnTypesColumns:
            columnTypes = columnTypes[columnTypes['column'].isin(columns)].copy()
            
            columnsToAdd = columns - columnTypesColumns
            new_columns = pd.DataFrame([
                {
                    'column': col,
                    'type': 'numerical',
                    'class': False,
                    'nullCount': 0,
                    'handleNullValues': 'Drop rows',
                    'uniqueValuesCount': 2,
                    'uniqueValues': [0, 1],
                    'valueToFillWith': None
                }
                for col in columnsToAdd
            ])
            
            columnTypes = pd.concat([columnTypes, new_columns], ignore_index=True)
            Data.set_columnTypes(columnTypes)

    @staticmethod
    def handleNullValues(colName, col, handleNullValues, valueToFillWith):
        data = pd.DataFrame(Data.get_data().copy())
        columnTypes = Data.get_columnTypes().copy()
        if not isinstance(columnTypes, pd.DataFrame):
            columnTypes = pd.DataFrame(columnTypes)
        column_data = columnTypes.loc[columnTypes['column'] == colName]
        print("column_data: ", column_data)
        print("handleNullValues: ", handleNullValues)
        print("data: ", data)
        if handleNullValues == 'Drop rows':
            data = data.dropna(subset=[colName])
        elif handleNullValues == 'Drop column':
            del data[colName]
        elif handleNullValues == 'Fill with average value':
            mean = round(data[colName].mean(), 2)
            data[colName] = data[colName].fillna(mean)
        elif handleNullValues == 'Fill with median':
            median = data[colName].median()
            data[colName] = data[colName].fillna(median)
        elif handleNullValues == 'Fill with specific value':
            data[colName] = data[colName].fillna(valueToFillWith)
        elif handleNullValues == 'Fill with most common value':
            mostCommon = data[colName].mode()[0]
            data[colName] = data[colName].fillna(mostCommon)
        elif handleNullValues == 'Ignore':
            pass
        column_data = columnTypes.loc[columnTypes['column'] == colName]
        if not column_data.empty and handleNullValues != 'Ignore':
            column_data['nullCount'] = 0
        Data.set_data(data)
        Data.set_columnTypes(columnTypes)
    
    @staticmethod
    def change_single_column_type(col, old_type, new_type, handleNullvalues, valueToFillWith):
        df_defaultTypes = pd.DataFrame(Data.get_columnTypes().copy())
        matching_row = df_defaultTypes[df_defaultTypes['column'] == col['column']]
        matching_row_index = df_defaultTypes[df_defaultTypes['column'] == col['column']].index
        data = pd.DataFrame(Data.get_data().copy())
        colName = col['column']

        df_defaultTypes.loc[matching_row_index, 'class'] = col['class']
        df_defaultTypes.loc[matching_row_index, 'handleNullValues'] = col['handleNullValues']
        df_defaultTypes.loc[matching_row_index, 'valueToFillWith'] = col['valueToFillWith']
        if old_type == 'numerical':
            if new_type == 'nominal' or new_type == 'categorical':
                #ZMIANA TYPU
                df_defaultTypes.loc[matching_row_index, 'type'] = new_type
                #ZAPIS DANYCH I
                Data.set_data(data)
                Data.set_columnTypes(df_defaultTypes)
                #UZUPELNIAM NULLE
                if data[colName].isnull().any():
                    Data.handleNullValues(colName, data[colName], handleNullvalues, valueToFillWith)
                    data = pd.DataFrame(Data.get_data().copy())
                print("jestem po handleNullValues")
                print("data", data)
                data.loc[:, colName] = data[colName].astype(str)
                print("jestem po zmianie na str")
                print("data", data)
                #ZAPIS DANYCH II
                Data.set_data(data)
    
        elif old_type == 'nominal':
            if new_type == 'numerical':
                #UZUPELNIAM NULLE
                if data[colName].isnull().any():
                    Data.handleNullValues(colName, data[colName], handleNullvalues, valueToFillWith)
                    data = pd.DataFrame(Data.get_data().copy())
                #ONE-HOT
                data.loc[:, colName] = data[colName].astype(str)
                data = pd.get_dummies(data, columns=[colName])
                #ZAPIS DANYCH I
                Data.set_data(data)
                Data.set_columnTypes(df_defaultTypes)
                Data.updateColumnTypes()
            elif new_type == 'categorical':
                #UZUPELNIAM NULLE
                if data[colName].isnull().any():
                    Data.handleNullValues(colName, data[colName], handleNullvalues, valueToFillWith)
                    data = pd.DataFrame(Data.get_data().copy())
                df_defaultTypes.loc[matching_row_index, 'type'] = new_type
                #ZAPIS DANYCH II
                Data.set_data(data)
                Data.set_columnTypes(df_defaultTypes)
                Data.updateColumnTypes()
        
        elif old_type == 'categorical':
            if new_type == 'numerical':
                #UZUPELNIAM NULLE
                if data[colName].isnull().any():
                    Data.handleNullValues(colName, data[colName], handleNullvalues, valueToFillWith)
                    data = pd.DataFrame(Data.get_data().copy())
                #ONE-HOT
                data = pd.get_dummies(data, columns=[colName])
                #ZAPIS DANYCH I
                Data.set_data(data)
                Data.set_columnTypes(df_defaultTypes)
                Data.updateColumnTypes()
            elif new_type == 'nominal':
                #UZUPELNIAM NULLE
                if data[colName].isnull().any():
                    Data.handleNullValues(colName, data[colName], handleNullvalues, valueToFillWith)
                    data = pd.DataFrame(Data.get_data().copy())
                df_defaultTypes.loc[matching_row_index, 'type'] = new_type
                #ZAPIS DANYCH II
                Data.set_data(data)
                Data.set_columnTypes(df_defaultTypes)
                Data.updateColumnTypes()
    
    @staticmethod
    def change_types(df):
        df_cols = pd.DataFrame(df['cols']).drop(columns=['headerName', 'width'])
        df_cols = df_cols.rename(columns={'field': 'column'})
        df_defaultTypes = pd.DataFrame(Data.get_columnTypes().copy())
        data = pd.DataFrame(Data.get_data().copy())
        data = data.replace({np.nan: None})
        df_cols = df_cols.replace({np.nan: None})
        df_defaultTypes = df_defaultTypes.replace({np.nan: None})
        Data.set_data(data)

        # Wyświetlenie DataFrame
        print("df_cols:")
        print(df_cols)

        print("\ndf_defaultTypes:")
        print(df_defaultTypes)

        print("\ndata:")
        print(data)

        for index, row in df_cols.iterrows():
            if row['column'] == 'id':  
                continue  
            print(f"index: {index}, row: {row}")
            if row['column'] in df_defaultTypes['column'].unique().tolist():
                matching_row = df_defaultTypes[df_defaultTypes['column'] == row['column']]
                if row['type'] != matching_row.iloc[0]['type']:
                    Data.change_single_column_type(row, matching_row.iloc[0]['type'], row['type'], row['handleNullValues'], row['valueToFillWith'])
                else:
                    Data.handleNullValues(row['column'], data[row['column']], row['handleNullValues'], row['valueToFillWith'])
        data = pd.DataFrame(Data.get_data().copy())
        data = data.replace({np.nan: None})
        Data.set_data(data)
        colTypes = pd.DataFrame(Data.get_columnTypes().copy())
        colTypes = colTypes.replace({np.nan: None})
        Data.set_columnTypes(colTypes)

    @staticmethod
    def normalize_column(col):
        data = pd.DataFrame(Data.get_data().copy())
        non_null_data = data[col].dropna()
        scaler = StandardScaler()
        normalized_values = scaler.fit_transform(non_null_data.values.reshape(-1, 1))
        data[col] = data[col].copy()  
        data.loc[non_null_data.index, col] = normalized_values.flatten()
        Data.set_data(data)

    @staticmethod
    def normalize_numerical(df):
        df_cols = pd.DataFrame(df['cols']).drop(columns=['headerName', 'width'])
        df_cols = df_cols.rename(columns={'field': 'column'})
        columnTypes = pd.DataFrame(Data.get_columnTypes().copy())
        data = pd.DataFrame(df['rows'])
        data = data.replace({np.nan: None})
        Data.set_data(data)
        print('data\n', Data.get_data())
        print('columnTypes1\n', Data.get_columnTypes())
        Data.updateColumnTypes()
        columnTypes = pd.DataFrame(Data.get_columnTypes().copy())

        # iteracja po kolumnach i normalizacja tych, które są numerical
        for index, row in columnTypes.iterrows():
                if row['column'] == 'id':  
                    continue  
                if row['type'] == 'numerical':
                    Data.normalize_column(row['column'])

        if isinstance(Data.get_columnTypes(), list) and all(isinstance(item, dict) for item in Data.get_columnTypes()):
            print('słowniki zamiast dataframe')
            Data.set_columnTypes(pd.DataFrame(Data.get_columnTypes()))

        print('columnTypes3\n', Data.get_columnTypes())

    @staticmethod
    def delete_column(df):
        df_cols = pd.DataFrame(df['cols']).drop(columns=['headerName', 'width'])
        df_cols = df_cols.rename(columns={'field': 'column'})
        data = pd.DataFrame(df['rows'])
        data = data.replace({np.nan: None})
        Data.set_data(data)
        Data.updateColumnTypes()
        columnToDelete = df['columnToDelete']
        new_data = data.drop(columns=[columnToDelete])
        Data.set_data(new_data)
        Data.updateColumnTypes()

    @staticmethod
    def delete_rows(df):
        df_cols = pd.DataFrame(df['cols']).drop(columns=['headerName', 'width'])
        df_cols = df_cols.rename(columns={'field': 'column'})
        data = pd.DataFrame(df['rows'])
        data = data.replace({np.nan: None})
        Data.set_data(data)
        Data.updateColumnTypes()
        rowsToDelete = df['selectedRows']
        adjusted_rowsToDelete = [i - 1 for i in rowsToDelete]
        new_data = data.drop(index=adjusted_rowsToDelete)
        new_data = new_data.reset_index(drop=True)
        new_data['id'] = new_data.index + 1
        new_data = new_data.replace({np.nan: None})
        Data.set_data(new_data)
        Data.updateColumnTypes()

    @staticmethod
    def replaceNaN(df):
        df = pd.DataFrame(df)
        df = df.replace({np.nan: None})
        return df



                






    

    
