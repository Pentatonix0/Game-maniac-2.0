from datetime import datetime
from application.services.db_service import *
from application.services.excel_service import ExcelService


class OrderService:

    @staticmethod
    def create_order_items(order_id, order_items):
        for order_item_dict in order_items:
            order_item_name = order_item_dict["name"]
            order_item_amount = order_item_dict["amount"]
            if not ItemDBService.get_item_by_name(order_item_name):
                ItemDBService.create_item(order_item_name)
            item = ItemDBService.get_item_by_name(order_item_name)
            OrderItemDBService.create_order_item(order_id, item.id, order_item_amount)

    @staticmethod
    def create_order(data):
        try:
            title = data.get("title")
            description = data.get("description")
            order_items = data.get("order_items")
            permitted_providers = data.get("permitted_providers")
            participating_providers = []
            publishing_date = datetime.now()
            order_status = StatusDBService.get_status_by_status_code(200)

            order = OrderDBService.create_order(title=title, description=description,
                                                permitted_providers=permitted_providers,
                                                participating_providers=participating_providers,
                                                status_id=order_status.id,
                                                publishing_date=publishing_date)

            OrderService.create_order_items(order.id, order_items)
            status = StatusDBService.get_status_by_status_code(100)
            for permitted_provider_id in permitted_providers:
                participant = OrderParticipantDBService.create_order_participant(order.id, permitted_provider_id,
                                                                                 status.id)
                for order_item in order.order_items:
                    price = OrderParticipantPriceDBService.create_order_participant_price(participant.id, order_item.id,
                                                                                          price=None)
                    OrderParticipantLastPriceDBSercice.create_order_participant_last_price(participant.id, price.id)
            response_object = {
                'status': 'success',
                'message': 'Order successfully created'
            }
            return response_object

        except Exception as e:
            print(e)
            response_object = {
                'status': 'fail',
                'message': 'Try again'
            }
            return response_object, 500

    @staticmethod
    def delete_order(id):
        try:
            OrderDBService.delete_order(id)
            responce_object = {
                "status": "success",
                "message": "Order successfully deleted"
            }
            return responce_object, 200
        except Exception as e:
            print(e)
            response_object = {
                'status': 'fail',
                'message': 'Try again'
            }
            return response_object, 500

    @staticmethod
    def get_all_orders():
        try:
            orders = OrderDBService.get_all_orders()
            orders = sorted(orders, key=lambda x: x.publishing_date, reverse=True)
            return orders, 200
        except Exception as e:
            print(e)
            response_object = {
                'status': 'fail',
                'message': 'Try again'
            }
            return response_object, 500

    @staticmethod
    def get_all_user_participation(username):
        try:
            participation = OrderDBService.get_all_participation(username)
            response_object = {
                "status": "success",
                "response": participation
            }
            return response_object
        except Exception as e:
            print(e)
            response_object = {
                'status': 'fail',
                'message': 'Try again'
            }
            return response_object

    @staticmethod
    def get_admin_order_content(order_id):
        try:
            order = OrderDBService.get_order_by_id(order_id)
            return order, 200
        except Exception as e:
            print(e)
            response_object = {
                'status': 'fail',
                'message': 'Try again'
            }
            return response_object, 500

    @staticmethod
    def get_user_order_content(username, order_id):
        try:
            order = OrderParticipantDBService.get_participant(username, order_id)
            return order, 200
        except Exception as e:
            print(e)
            response_object = {
                "status": "success",
                "response": {}
            }
            return response_object, 500

    @staticmethod
    def offer_price(username, data):
        try:
            order_id = data.get("order_id")
            prices = data.get("prices")
            participant = OrderParticipantDBService.get_participant(username, order_id)
            new_status = StatusDBService.get_status_by_status_code(101)
            for last_price in participant.last_prices:
                order_item_id = last_price.price.order_item_id
                price_dict = prices[str(order_item_id)]
                price = price_dict["price"]
                comment = price_dict["comment"]
                new_price = OrderParticipantPriceDBService.create_order_participant_price(participant.id, order_item_id,
                                                                                          price, comment)
                OrderParticipantLastPriceDBSercice.update_last_price_price_id(last_price, new_price.id)
            OrderParticipantDBService.update_participant_status(participant, new_status.id)
            OrderParticipantDBService.set_is_participating(participant, True)
            response_object = {
                'status': 'success',
                'responce': {'status': 'success'}
            }
            return response_object
        except Exception as e:
            print(e)
            response_object = {
                'status': 'fail',
                'message': 'Try again'
            }
            return response_object

    @staticmethod
    def get_current_order_state(order_id):
        active_participants = OrderParticipantDBService.get_all_active_participants(order_id)
        order_items = OrderItemDBService.get_all_order_items(order_id)
        # {prt.user.company: None for prt in active_participants}}
        summary = {order_item.item.name: {'name': order_item.item.name, 'amount': order_item.amount} for
                   order_item in
                   order_items}

        for participant in active_participants:
            company = participant.user.company
            user_id = participant.user.id
            for last_price in participant.last_prices:
                name = last_price.price.order_item.item.name
                summary[name][company] = last_price.price.price
                summary[name][f"comment_{user_id}"] = last_price.price.comment
        print(summary)
        summary_excel = list(summary.values())
        file_stream = ExcelService.make_summary_excel(summary_excel)
        return file_stream

    @staticmethod
    def update_order_meta(order_id, data):
        try:
            title = data.get('title')
            description = data.get('description')
            OrderDBService.update_order_meta(order_id, title, description)

            responce_object = {
                "status": "success",
                "message": "Order meta updated deleted"
            }

            return responce_object, 200
        except Exception as e:
            print(e)
            response_object = {
                'status': 'fail',
                'message': 'Try again'
            }
            return response_object, 500





