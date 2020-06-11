import os

from flask import Flask,render_template,request,redirect,url_for,flash
from flask_socketio import SocketIO, emit,send
from forms import SignUpForm

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

cridentials=['dewole','dewoleawe@gmail.com','password']
room_user=[]
g_name=""
@app.route("/")
def index():
    return render_template("home.html")

@app.route("/create", methods=["POST","GET"])
def create():
    form=SignUpForm()
    if form.validate_on_submit():
        name=form.name.data
        g_name=form.name.data
        if len(room_user)==0:
            room_user.append(name)
            print(room_user)
            return redirect(url_for('active'))
        elif name in room_user:
            flash("name already exit, Login instead",'danger') 
            return render_template("create.html", form=form)
        else:
            room_user.append(name)
            return render_template("buddyroom.html",name=name)
                    

    
    return render_template("create.html", form=form)

@app.route('/chat',methods=["POST","GET"])
def chat():
    return render_template("find.html")



@app.route("/active",methods=["POST","GET"])
def active():
    print(room_user)
    return render_template("buddyroom.html",)

@socketio.on('message')
def message(msg):
    print(f"\n\n{msg}\n\n")
    send(msg)
    emit('a_message',f"{msg} + emmitted ")