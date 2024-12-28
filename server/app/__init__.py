from flask import Flask
from flask_cors import CORS
from app.controllers.data_controller import data_blueprint
from app.controllers.algorithms_controller import algorithms_blueprint

def create_app():
    app = Flask(__name__)

    CORS(app)

    app.register_blueprint(data_blueprint, url_prefix='/data')
    app.register_blueprint(algorithms_blueprint, url_prefix='/algorithms')

    return app
