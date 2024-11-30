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
        df.columns = df.columns.str.lower()

        if "id" not in df.columns:
            df.insert(0, "id", range(1, len(df)+1))
        return df
    

    
