# from flask import Flask, request, jsonify, make_response
# from flask_restx import Api, Resource, Namespace, fields
# from datetime import timedelta, datetime
# from models import User, UsersOrdersApplications
# from werkzeug.security import generate_password_hash, check_password_hash
# from flask_jwt_extended import (JWTManager, create_access_token, jwt_required,
#                                 create_refresh_token, get_jwt_identity)
#
#
# class UserOrderService:
#     @staticmethod
#     def create_users_orders_application(admin_order):
#         users = User.query.all()
#         print(admin_order.id, "\n--------------------admin-------------------\n")
#         for user in users:
#             if user.role != "admin" and user.id in admin_order.permitted_providers:
#                 new_order = UsersOrdersApplications(
#                     user_id=user.id,
#                     order_id=admin_order.id,
#                     title=admin_order.title,
#                     description=admin_order.description,
#                     status=100,
#                     data=admin_order.order_items,
#                     publishing_date=admin_order.publishing_date,
#                     bidding_deadline=None,
#                     is_haggled=False,
#                     updates_counter=0
#                 )
#                 new_order.save()
#
#     @staticmethod
#     def get_user_orders_preview(username):
#         try:
#             user = User.query.filter_by(username=username).first()
#             user_orders_sorted = sorted(user.orders, key=lambda x: x.publishing_date, reverse=True)
#             response_object = user_orders_sorted
#             return response_object, 200
#         except Exception as e:
#             print(e)
#             response_object = {
#                 'status': 'fail',
#                 'message': 'Try again'
#             }
#             return response_object, 500
#
#     @staticmethod
#     def get_user_order_content(username, order_id):
#         try:
#             user = User.query.filter_by(username=username).first()
#             order = next(
#                 (order for order in user.orders if order.id == order_id), None)
#             if not order:
#                 response_object = {'status': 'success',
#                                    'message': 'Order not found'}
#                 return response_object, 404
#             return order, 200
#         except Exception as e:
#             print(e)
#             response_object = {
#                 'status': 'fail',
#                 'message': 'Try again'
#             }
#             return response_object, 500
#
#     @staticmethod
#     def set_user_prices(username, order_id, data):
#         try:
#             prices = data.get('data')
#             user = User.query.filter_by(username=username).first()
#             order = next(
#                 (order for order in user.orders if order.id == order_id), None)
#             admin_order = order.order
#             order.participate(prices)
#             admin_order.addParticipator(user)
#             response_object = {
#                 'status': 'success',
#                 'message': 'Prices updated'
#             }
#             return response_object, 201
#         except Exception as e:
#             print(e)
#             response_object = {
#                 'status': 'fail',
#                 'message': 'Try again'
#             }
#             return response_object, 500
