from flask import Flask
from flask_cors import CORS
from app.controllers.routes import data_blueprint

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(data_blueprint, url_prefix='/data')

    return app
