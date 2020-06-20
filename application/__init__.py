import os

from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config['SQLALCHEMY_DATABASE_URI']="postgresql://postgres:BOLAwole_1995@localhost/flack"
socketio = SocketIO(app)
db=SQLAlchemy(app)
login_manager=LoginManager(app)

from application import routes