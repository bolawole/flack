import os

from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
app = Flask(__name__)
app.config["SECRET_KEY"] = "MYSERETKEYLOL"
app.config['SQLALCHEMY_DATABASE_URI']="insert your database url here"
socketio = SocketIO(app)
db=SQLAlchemy(app)
login_manager=LoginManager(app)

from application import routes
