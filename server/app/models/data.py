import pandas as pd

class Data:
    @staticmethod
    def read_data(file):
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file)
            
        elif file.filename.endswith('.xls') or file.filename.endswith('.xlsx'):
            df = pd.read_excel(file)
        return df

    @staticmethod
    def map_data_id(df):
        columnsNames = list(df.columns)
        df.columns = map(str.lower, df.columns)
        if "id" in columnsNames:
            pass
        else:
            df.insert(0, "id", range(1, len(df)+1))
        return df
    

    
