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
        # print("jestem w updateColumnTypes")
    
        # Skopiowanie danych i typów kolumn
        data = Data.get_data().copy()
        # print("data", data)
        
        columnTypes = Data.get_columnTypes().copy()
        # print("columnTypes", columnTypes)
        
        # Zamiana columnTypes na DataFrame, jeśli jeszcze nim nie jest
        if not isinstance(columnTypes, pd.DataFrame):
            columnTypes = pd.DataFrame(columnTypes)
        
        # Zestaw nazw kolumn w danych
        columns = set(data.columns)
        # print("columns in data:", columns)
        
        # Zestaw kolumn w columnTypes
        columnTypesColumns = set(columnTypes['column'])
        # print("columns in columnTypes:", columnTypesColumns)
        
        # Sprawdzenie różnicy między kolumnami w data i columnTypes
        if columns != columnTypesColumns:
            # Usunięcie wierszy z columnTypes dla kolumn, których nie ma w data
            columnTypes = columnTypes[columnTypes['column'].isin(columns)].copy()
            
            # Znalezienie kolumn do dodania
            columnsToAdd = columns - columnTypesColumns
            # print("columns to add:", columnsToAdd)
            
            # Tworzenie DataFrame dla brakujących kolumn
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
            
            # Dodanie nowych kolumn do columnTypes
            columnTypes = pd.concat([columnTypes, new_columns], ignore_index=True)
            # print("updateColumnTypes - updated columnTypes:", columnTypes)
            
            # Zapis zaktualizowanego columnTypes
            Data.set_columnTypes(columnTypes)

    @staticmethod
    def handleNullValues(colName, col, handleNullValues, valueToFillWith):
        print("jestem w handleNullValues")
        print("col", col)
        #colName = col['column']
        data = pd.DataFrame(Data.get_data().copy())
        columnTypes = Data.get_columnTypes().copy()
        if not isinstance(columnTypes, pd.DataFrame):
            columnTypes = pd.DataFrame(columnTypes)
        column_data = columnTypes.loc[columnTypes['column'] == colName]
        print("column_data: ", column_data)
        #handleNullValues = column_data['handleNullValues'].iloc[0]
        print("handleNullValues: ", handleNullValues)
        #handleNullValues = handleNullValues.iloc[1]
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
            print("valueToFillWith", column_data['valueToFillWith'])
            print("data[colName]", data[colName])
            #valueToFillWith = column_data['valueToFillWith'].iloc[1]
            data[colName] = data[colName].fillna(valueToFillWith)
        elif handleNullValues == 'Fill with most common value':
            print("wypełniam najczęstszą wartością")
            print("valueToFillWith", column_data['valueToFillWith'])
            print("data[colName]", data[colName])
            mostCommon = data[colName].mode()[0]
            print(mostCommon)
            data[colName] = data[colName].fillna(mostCommon)
        elif handleNullValues == 'Ignore':
            pass
        print("data bez nulli: ", data)
        column_data = columnTypes.loc[columnTypes['column'] == colName]
        if not column_data.empty and handleNullValues != 'Ignore':
            column_data['nullCount'] = 0
            #data.loc[column_data.index, 'nullCount'] = 0
        Data.set_data(data)
        Data.set_columnTypes(columnTypes)
        print("data bez nulli po zapisie: ", Data.get_data())
    
    @staticmethod
    def change_single_column_type(col, old_type, new_type, handleNullvalues, valueToFillWith):
        print("1")
        df_defaultTypes = pd.DataFrame(Data.get_columnTypes().copy())
        print("2")
        matching_row = df_defaultTypes[df_defaultTypes['column'] == col['column']]
        matching_row_index = df_defaultTypes[df_defaultTypes['column'] == col['column']].index
        print("3")
        data = pd.DataFrame(Data.get_data().copy())
        print("4")
        colName = col['column']
        print("5")

        #zmieniam class kolumny, jeśli class jest true
        #matching_row['class'] = col['class']
        df_defaultTypes.loc[matching_row_index, 'class'] = col['class']
        print("6")
        #zmieniam handleNullValues
        #matching_row['handleNullValues'] = col['handleNullValues']
        df_defaultTypes.loc[matching_row_index, 'handleNullValues'] = col['handleNullValues']
        print("7")
        #zmieniam valueToFill
        print("matching_row['valueToFillWith']", matching_row['valueToFillWith'])
        print("8")
        print("col", col)
        print("col['valueToFill']", col['valueToFillWith'])
        #matching_row['valueToFill'] = col['valueToFill']
        df_defaultTypes.loc[matching_row_index, 'valueToFillWith'] = col['valueToFillWith']
        print("9")
        if old_type == 'numerical':
            print("A")
            print("new_type", new_type)
            print("old_type", old_type)
            if new_type == 'nominal' or new_type == 'categorical':
                print("A1")
                #ZMIANA TYPU
                #zmieniam typ kolumny w kopii columnTypes na nominal lub categorical
                df_defaultTypes.loc[matching_row_index, 'type'] = new_type
                #ZAPIS DANYCH I
                Data.set_data(data)
                Data.set_columnTypes(df_defaultTypes)
                #UZUPELNIAM NULLE
                print("czy są nulle:", data[colName].isnull().any())
                if data[colName].isnull().any():
                    Data.handleNullValues(colName, data[colName], handleNullvalues, valueToFillWith)
                    data = pd.DataFrame(Data.get_data().copy())
                #data[colName] = Data.handleNullValues(col)
                print("jestem po handleNullValues")
                print("data", data)
                #zmieniam typ kolumny w kopii data na string
                data.loc[:, colName] = data[colName].astype(str)
                print("jestem po zmianie na str")
                print("data", data)
                #ZAPIS DANYCH II
                Data.set_data(data)
            else:
                print("A2")
    
        elif old_type == 'nominal':
            print("B")
            if new_type == 'numerical':
                print("B1")
                #UZUPELNIAM NULLE
                if data[colName].isnull().any():
                    Data.handleNullValues(colName, data[colName], handleNullvalues, valueToFillWith)
                    data = pd.DataFrame(Data.get_data().copy())
                #data[colName] = Data.handleNullValues(col)
                print("colName", colName)
                print("data[colName]", data[colName])
                #ONE-HOT
                print("będę enkodować dane")
                print("kolumna do enkodowania: ", colName)
                print("dane przed enkodowaniem: ", data[colName])
                print("całe dane przed enkodowaniem: ", data)
                data.loc[:, colName] = data[colName].astype(str)
                data = pd.get_dummies(data, columns=[colName])
                print("data po enkodowaniu: ", data)
                #ZAPIS DANYCH I
                Data.set_data(data)
                Data.set_columnTypes(df_defaultTypes)
                print("DataFrame w obiekcie Data po zapisie:", Data.get_data())
                #ZAKTUALIZOWANIE COLUMN TYPES
                Data.updateColumnTypes()
                print("ColumnTypes w obiekcie Data po zapisie:", Data.get_columnTypes())
            elif new_type == 'categorical':
                print("B2")
                #UZUPELNIAM NULLE
                if data[colName].isnull().any():
                    Data.handleNullValues(colName, data[colName], handleNullvalues, valueToFillWith)
                    data = pd.DataFrame(Data.get_data().copy())
                #data[colName] = Data.handleNullValues(col)
                #tylko nazwa typu się zmienia
                df_defaultTypes.loc[matching_row_index, 'type'] = new_type
                #ZAPIS DANYCH I
                Data.set_data(data)
                Data.set_columnTypes(df_defaultTypes)
                #ZAKTUALIZOWANIE COLUMN TYPES
                Data.updateColumnTypes()
            else:
                print("B3")
        
        elif old_type == 'categorical':
            print("C")
            if new_type == 'numerical':
                print("C1")
                #UZUPELNIAM NULLE
                if data[colName].isnull().any():
                    Data.handleNullValues(colName, data[colName], handleNullvalues, valueToFillWith)
                    data = pd.DataFrame(Data.get_data().copy())
                #data[colName] = Data.handleNullValues(col)
                #ONE-HOT
                data = pd.get_dummies(data, columns=[colName])
                #ZAPIS DANYCH I
                Data.set_data(data)
                Data.set_columnTypes(df_defaultTypes)
                #ZAKTUALIZOWANIE COLUMN TYPES
                Data.updateColumnTypes()
            elif new_type == 'nominal':
                print("C2")
                #UZUPELNIAM NULLE
                if data[colName].isnull().any():
                    Data.handleNullValues(colName, data[colName], handleNullvalues, valueToFillWith)
                    data = pd.DataFrame(Data.get_data().copy())
                #data[colName] = Data.handleNullValues(col)
                #tylko nazwa typu się zmienia
                df_defaultTypes.loc[matching_row_index, 'type'] = new_type
                #ZAPIS DANYCH I
                Data.set_data(data)
                Data.set_columnTypes(df_defaultTypes)
                #ZAKTUALIZOWANIE COLUMN TYPES
                Data.updateColumnTypes()
            else:
                print("C3")
        else:
            print("D")
    
    @staticmethod
    def change_types(df):
        print("jestem w metodzie change_types")
        df_cols = pd.DataFrame(df['cols']).drop(columns=['headerName', 'width'])
        df_cols = df_cols.rename(columns={'field': 'column'})
        df_defaultTypes = pd.DataFrame(Data.get_columnTypes().copy())
        data = pd.DataFrame(Data.get_data().copy())
        data = data.replace({np.nan: None})
        df_cols = df_cols.replace({np.nan: None})
        df_defaultTypes = df_defaultTypes.replace({np.nan: None})
        Data.set_data(data)

        # Wyświetlenie obu DataFrame
        print("df_cols:")
        print(df_cols)

        print("\ndf_defaultTypes:")
        print(df_defaultTypes)

        print("\ndata:")
        print(data)

        for index, row in df_cols.iterrows():
            if row['column'] == 'id':  # Jeśli kolumna ma wartość 'id', pomiń ten wiersz
                continue  # Pomiń dalszą część iteracji dla tego wiersza
            print(f"index: {index}, row: {row}")
            print("jestem w forze przy kolumnie ", row['column'])
            #match = any(d['column'] == row['column'] for d in df_defaultTypes)
            print("row[column]:", row['column'])
            print("df_defaultColumnTypes toList:", df_defaultTypes['column'].unique().tolist())
            if row['column'] in df_defaultTypes['column'].unique().tolist():
                print("kolumna jest w defaultColumns")
                print("row['type']", row['type'])
                matching_row = df_defaultTypes[df_defaultTypes['column'] == row['column']]
                print("matching row", df_defaultTypes[df_defaultTypes['column'] == row['column']])
                if row['type'] != matching_row.iloc[0]['type']:
                    print("będę zmieniać typ i wypełniać nulle w kolumnie ", row['column'])
                    print("handleNullValues: ", row['handleNullValues'])
                    print("valueToFillWith:", row['valueToFillWith'])
                    Data.change_single_column_type(row, matching_row.iloc[0]['type'], row['type'], row['handleNullValues'], row['valueToFillWith'])
                else:
                    print("będę wypełniać nulle w kolumnie ", row['column'])
                    print("row", row)
                    print("handleNullValues: ", row['handleNullValues'])
                    print("valueToFillWith:", row['valueToFillWith'])
                    Data.handleNullValues(row['column'], data[row['column']], row['handleNullValues'], row['valueToFillWith'])
                    #Data.set_data(df_cols)
        data = pd.DataFrame(Data.get_data().copy())
        data = data.replace({np.nan: None})
        Data.set_data(data)
        colTypes = pd.DataFrame(Data.get_columnTypes().copy())
        colTypes = colTypes.replace({np.nan: None})
        Data.set_columnTypes(colTypes)

    @staticmethod
    def normalize_column(col):
        data = pd.DataFrame(Data.get_data().copy())
        print("col", col)
        print("data[col]", data[col])

        # Separowanie wartości nie-NaN
        non_null_data = data[col].dropna()
        
        # MinMaxScaler wymaga danych w formacie 2D, więc przekształcamy
        # scaler = MinMaxScaler(feature_range=(0, 1))
        # normalized_values = scaler.fit_transform(non_null_data.values.reshape(-1, 1))

        scaler = StandardScaler()
        normalized_values = scaler.fit_transform(non_null_data.values.reshape(-1, 1))
        
        # Tworzymy nową kolumnę z zachowaniem brakujących wartości
        data[col] = data[col].copy()  # Tworzymy kopię dla bezpieczeństwa
        data.loc[non_null_data.index, col] = normalized_values.flatten()
        Data.set_data(data)

    @staticmethod
    def normalize_numerical(df):
        print("jestem w metodzie normalize_data")
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
        # tu jeszcze column types było git (tak samo w obu)

        # Wyświetlenie obu DataFrame
        # print("df_cols:")
        # print(df_cols)

        # print("\ncolumnTypes:")
        # print(columnTypes)

        # print("\ndata:")
        # print(data)

        # iteracja po kolumnach i normalizacja tych, które są numerical
        for index, row in columnTypes.iterrows():
                if row['column'] == 'id':  # Jeśli kolumna ma wartość 'id', pomiń ten wiersz
                    continue  # Pomiń dalszą część iteracji dla tego wiersza
                if row['type'] == 'numerical':
                    Data.normalize_column(row['column'])

        if isinstance(Data.get_columnTypes(), list) and all(isinstance(item, dict) for item in Data.get_columnTypes()):
            print('słowniki zamiast dataframe')
            Data.set_columnTypes(pd.DataFrame(Data.get_columnTypes()))

        print('columnTypes3\n', Data.get_columnTypes())
        #po tym juz się nie zgadzają columnTypes wiec dodałam tego ifa powyżej

    @staticmethod
    def delete_column(df):
        print("jestem w metodzie delete_column")
        df_cols = pd.DataFrame(df['cols']).drop(columns=['headerName', 'width'])
        df_cols = df_cols.rename(columns={'field': 'column'})
        data = pd.DataFrame(df['rows'])
        data = data.replace({np.nan: None})
        Data.set_data(data)
        Data.updateColumnTypes()
        columnToDelete = df['columnToDelete']
        print("columnToDelete:", columnToDelete)
        new_data = data.drop(columns=[columnToDelete])
        Data.set_data(new_data)
        Data.updateColumnTypes()

    @staticmethod
    def delete_rows(df):
        print("jestem w metodzie delete_rows")
        df_cols = pd.DataFrame(df['cols']).drop(columns=['headerName', 'width'])
        df_cols = df_cols.rename(columns={'field': 'column'})
        data = pd.DataFrame(df['rows'])
        data = data.replace({np.nan: None})
        Data.set_data(data)
        Data.updateColumnTypes()
        rowsToDelete = df['selectedRows']
        print("rowsToDelete:", rowsToDelete)
        adjusted_rowsToDelete = [i - 1 for i in rowsToDelete]
        print("adjrowsToDelete:", adjusted_rowsToDelete)
        new_data = data.drop(index=adjusted_rowsToDelete)
        new_data = new_data.reset_index(drop=True)
        new_data['id'] = new_data.index + 1
        print("new_data[id]: ", new_data["id"])
        new_data = new_data.replace({np.nan: None})
        Data.set_data(new_data)
        Data.updateColumnTypes()

    @staticmethod
    def replaceNaN(df):
        df = pd.DataFrame(df)
        df = df.replace({np.nan: None})
        return df



                






    

    
