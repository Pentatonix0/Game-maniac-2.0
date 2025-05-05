import pandas as pd
import re
import io


class ExcelService:
    @staticmethod
    def convert_excel_to_json(excel_file):
        try:
            df = pd.read_excel(excel_file)
            order_data = []
            for index, row in df.iterrows():
                row_dict = row.to_dict()
                order_data.append(row_dict)
            return order_data
        except Exception as e:
            print(e)
            response_object = {
                'status': 'fail',
                'message': 'Try again'
            }
            return response_object, 500

    @staticmethod
    def make_summary_excel(summary):
        df = pd.DataFrame(summary)

        price_columns = [col for col in df.columns if
                         col not in ['name', 'amount'] and not re.match(r'comment_\d+', col)]

        for col in price_columns:
            df[col] = df[col].astype(float)

        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False)
        output.seek(0)
        return output