import pandas as pd


class ExcelService:
    @staticmethod
    def convert_excel_to_json(excel_file):
        try:
            df = pd.read_excel(excel_file)
            order_data = []
            for index, row in df.iterrows():
                row_dict = row.to_dict()
                if row_dict['amount'] != 0:
                    row_dict['rating'] = 0
                    order_data.append(row_dict)
            return order_data
        except Exception as e:
            print(e)
            response_object = {
                'status': 'fail',
                'message': 'Try again'
            }
            return response_object, 500
