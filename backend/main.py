from flask import Flask
from flask_restx import Api
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from exts import db
from presentation.api.controllers.order_controller import order_ns
from presentation.api.controllers.auth_controller import auth_ns
from presentation.api.controllers.user_controller import users_ns
from presentation.api.controllers.excel_controller import excel_ns
from application.services.db_service import PrimaryInitialization
from config import DevConfig as config
from threading import Lock

init_lock = Lock()

app = Flask(__name__)
app.config.from_object(config)
app.config['JSON_AS_ASCII'] = False

CORS(app, origins="http://localhost:5173")

db.init_app(app)
with app.app_context():
    db.create_all()

migrate = Migrate(app, db)
JWTManager(app)

# with init_lock:
#     with app.app_context():
#         PrimaryInitialization.init()

api = Api(app, doc='/docs')
api.add_namespace(order_ns)
api.add_namespace(auth_ns)
api.add_namespace(users_ns)
api.add_namespace(excel_ns)

if __name__ == "__main__":
    app.run()
