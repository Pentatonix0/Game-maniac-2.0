from flask import request
from flask_restx import Resource
from presentation.api.models.order_models import OrderDTO
from application.services.order_service import OrderService
from flask_jwt_extended import jwt_required, get_jwt_identity
from presentation.api.decorators.admin_required import admin_required

order_ns = OrderDTO.namespace
order_participant_model = OrderDTO.order_participant_model
order_model = OrderDTO.order_model
order_participant_preview_model = OrderDTO.order_participant_preview_model
order_participant_model = OrderDTO.order_participant_model
order_preview_model = OrderDTO.order_preview_model


@order_ns.route('/create_admin_order')
class CreateAdminOrder(Resource):
    @order_ns.expect(order_model)
    @jwt_required()
    @admin_required
    def post(self):
        data = request.json
        return OrderService.create_order(data)
    
@order_ns.route('/delete_order')
class DeleteOrder(Resource):
    @order_ns.doc(params={'id': 'Id of the order to delete'})
    @jwt_required()
    @admin_required
    def delete(self):
        id = request.args.get('id')

        if not id:
            return {"message": "Id is required"}, 400

        response, code = OrderService.delete_order(id)

        return response, code



@order_ns.route('/get_all_orders')
class GetAllOrdersPreview(Resource):
    @order_ns.marshal_list_with(order_preview_model)
    def get(self):
        return OrderService.get_all_orders()


@order_ns.route('/get_all_user_participation')
class GetAllUserOrderParticipation(Resource):
    @jwt_required()
    def get(self):
        username = get_jwt_identity()
        response_object = OrderService.get_all_user_participation(username)
        if response_object["status"] == "success":
            response = response_object["response"]
            return order_ns.marshal(response, order_participant_preview_model), 200
        else:
            return response_object, 400


@order_ns.route('/admin_order/<int:order_id>')
class GetAdminOrderContent(Resource):
    @order_ns.marshal_with(order_model)
    def get(self, order_id):
        return OrderService.get_admin_order_content(order_id)


@order_ns.route('/order/<int:order_id>')
class GetOrderContent(Resource):
    @order_ns.marshal_with(order_participant_model)
    @jwt_required()
    def get(self, order_id):
        username = get_jwt_identity()
        return OrderService.get_user_order_content(username, order_id)

@order_ns.route('/offer_prices')
class GetOrderContent(Resource):
    @jwt_required()
    def post(self):
        username = get_jwt_identity()
        data = request.json
        responce_object = OrderService.offer_price(username, data)
        if responce_object["status"] == "success":
            return responce_object["responce"], 201
        return responce_object, 400

# @order_ns.route('/<string:username>/order/<int:order_id>')
# class UserOrderContent(Resource):
#     @order_ns.marshal_with(user_order_model)
#     def get(self, username, order_id):
#         return UserOrderService.get_user_order_content(username, order_id)
#
#     @order_ns.expect(user_order_model)
#     def put(self, username, order_id):
#         data = request.json
#         return UserOrderService.set_user_prices(username, order_id, data)
#
# @order_ns.route('/<string:username>')
# class GetUserOrdersPreview(Resource):
#     @order_ns.marshal_list_with(user_order_preview_model)
#     # @jwt_required()
#     def get(self, username):
#         return UserOrderService.get_user_orders_preview(username)
