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
        print("jestem w updateColumnTypes")
        data = Data.get_data().copy()
        print("data", data)
        columnTypes = Data.get_columnTypes().copy()
        print("columnTypes", columnTypes)
        columns = set(data.columns)
        #kolumny listy słowników
        columnTypesColumns = {colType['column'] for colType in columnTypes}
        if columns != columnTypesColumns:
            #usunięcie z columnTypes tych kolumn, których nie ma w data
            columnTypes = [colType for colType in columnTypes if colType['column'] in columns]
            #dodanie do columnTypes tych kolumn, których jeszcze w nim nie ma
            columnsToAdd = columns - columnTypesColumns
            for col in columnsToAdd:
                new_dict = {'column': col, 'type': 'numerical', 'class': 'false', 'nullCount': 0, 'handleNullValues': 'Ignore', 'uniqueValuesCount': 2, 'uniqueValues': [0, 1], 'valueToFillWith': None}
                columnTypes.append(new_dict)
            Data.set_columnTypes(columnTypes)

    @staticmethod
    def handleNullValues(col):
        print("jestem w handleNullValues")
        colName = col['column']
        data = Data.get_data().copy()
        columnTypes = Data.get_columnTypes().copy()
        handleNullValues = col['handleNullValues']
        print("handleNullValues: ", handleNullValues)
        print("data: ", data)
        if handleNullValues == 'Drop rows':
            data = data.dropna(subset=[colName])
        elif handleNullValues == 'Drop column':
            del data[colName]
        elif handleNullValues == 'Fill with average value':
            mean = data[colName].mean()
            data[colName] = data[colName].fillna(mean)
        elif handleNullValues == 'Fill with median':
            median = data[colName].median()
            data[colName] = data[colName].fillna(median)
        elif handleNullValues == 'Fill with specific value':
            print("valueToFillWith", col['valueToFillWith'])
            print("data[colName]", data[colName])
            valueToFillWith = col['valueToFillWith']
            data[colName] = data[colName].fillna(valueToFillWith)
        elif handleNullValues == 'Ignore':
            pass
        print("data bez nulli: ", data)
        # Znajdź odpowiedni słownik
        column_data = next((col for col in columnTypes if col['column'] == colName), None)

        # Jeśli istnieje, zaktualizuj 'nullCount'
        if column_data:
            column_data['nullCount'] = 0

        #columnTypes.loc[columnTypes['column'] == colName, 'nullCount'].values[0] = 0
        #columnTypes[colName]['nullCount'] = 0
        Data.set_data(data)
        Data.set_columnTypes(columnTypes)
        print("data bez nulli po zapisie: ", Data.get_data())
    
    @staticmethod
    def change_single_column_type(col, old_type, new_type):
        print("1")
        df_defaultTypes = pd.DataFrame(Data.get_columnTypes().copy())
        print("2")
        matching_row = df_defaultTypes[df_defaultTypes['column'] == col['column']]
        matching_row_index = df_defaultTypes[df_defaultTypes['column'] == col['column']].index
        print("3")
        data = Data.get_data().copy()
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
            if new_type == 'nominal' | new_type == 'categorical':
                print("A1")
                #ZMIANA TYPU
                #zmieniam typ kolumny w kopii data na string
                data[colName] = data[colName].astype(str)
                #zmieniam typ kolumny w kopii columnTypes na nominal lub categorical
                matching_row['type'] = new_type
                #ZAPIS DANYCH I
                Data.set_data(data)
                Data.set_columnTypes(df_defaultTypes)
                #UZUPELNIAM NULLE
                data[colName] = Data.handleNullValues(col)
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
                    data[colName] = Data.handleNullValues(data[colName])
                #data[colName] = Data.handleNullValues(col)
                print("colName", colName)
                print("data[colName]", data[colName])
                #ONE-HOT
                print("będę enkodować dane")
                print("kolumna do enkodowania: ", colName)
                print("dane przed enkodowaniem: ", data[colName])
                print("całe dane przed enkodowaniem: ", data)
                data[colName] = data[colName].astype(str)
                data = pd.get_dummies(data, columns=[colName])
                print("data po enkodowaniu: ", data)
                #ZAPIS DANYCH I
                Data.set_data(data)
                print("DataFrame w obiekcie Data po zapisie:", Data.get_data())
                #ZAKTUALIZOWANIE COLUMN TYPES
                Data.updateColumnTypes()
                print("ColumnTypes w obiekcie Data po zapisie:", Data.get_columnTypes())
            elif new_type == 'categorical':
                print("B2")
                #UZUPELNIAM NULLE
                data[colName] = Data.handleNullValues(col)
                #tylko nazwa typu się zmienia
                matching_row['type'] = new_type
                #ZAPIS DANYCH I
                Data.set_data(data)
                #ZAKTUALIZOWANIE COLUMN TYPES
                Data.updateColumnTypes()
            else:
                print("B3")
        
        elif old_type == 'categorical':
            print("C")
            if new_type == 'numerical':
                print("C1")
                #UZUPELNIAM NULLE
                data[colName] = Data.handleNullValues(col)
                #ONE-HOT
                data = pd.get_dummies(data, columns=[colName])
                #ZAPIS DANYCH I
                Data.set_data(data)
                #ZAKTUALIZOWANIE COLUMN TYPES
                Data.updateColumnTypes()
            elif new_type == 'nominal':
                print("C2")
                #UZUPELNIAM NULLE
                data[colName] = Data.handleNullValues(col)
                #tylko nazwa typu się zmienia
                matching_row['type'] = new_type
                #ZAPIS DANYCH I
                Data.set_data(data)
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
        data = Data.get_data()
        data = data.replace({np.nan: None})
        Data.set_data(data)

        # Wyświetlenie obu DataFrame
        print("df_cols:")
        print(df_cols)

        print("\ndf_defaultTypes:")
        print(df_defaultTypes)

        print("\ndata:")
        print(data)

        #df_cols = pd.DataFrame(df['cols'])
        #df_defaultTypes = pd.DataFrame(df['defaultTypes'])

        # for col in df_cols:
        #     print("jestem w forze przy kolumnie ", col)
        #     if col in df_defaultTypes:
        #         if df_cols[col]['type'] != df_defaultTypes[col]['type']:
        #             print("będę zmieniać typ i wypełniać nulle w kolumnie ", col['column'])
        #             Data.change_single_column_type(col, df_defaultTypes[col]['type'], df_cols[col]['type'])
        #         else:
        #             print("będę wypełniać nulle w kolumnie ", col['column'])
        #             df_cols[col] = Data.handleNullValues(col)
        #             Data.set_data(df_cols)

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
                    Data.change_single_column_type(row, matching_row.iloc[0]['type'], row['type'])
                else:
                    print("będę wypełniać nulle w kolumnie ", row['column'])
                    Data.handleNullValues(row)
                    #Data.set_data(df_cols)
        data = pd.DataFrame(Data.get_data().copy())
        data = data.replace({np.nan: None})
        Data.set_data(data)
            






    

    
