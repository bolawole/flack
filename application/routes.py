from flask import render_template,request,redirect,url_for,flash
from flask_socketio import emit,send
from application.forms import SignUpForm,LoginForm
from application.models import User
from application import app,socketio,db
from flask_login import login_user,current_user


@app.route("/")
def index():
    return render_template("home.html")

@app.route("/create", methods=["POST","GET"])
def create():
    form=SignUpForm()
    if form.validate_on_submit():
        new_user=User(username=form.name.data,email=form.email.data,password=form.password.data)
        db.session.add(new_user)
        db.session.commit()
        flash(f"Room Created","success")
        return redirect(url_for('login'))

    return render_template("create.html", form=form)


@app.route("/login", methods=["POST","GET"])
def login():
    form=LoginForm()
    if form.validate_on_submit():
        user=User.query.filter_by(username=form.name.data).first()
        if user:
            login_user(user)
            return redirect(url_for('active'))
            # return render_template("buddyroom.html",name=user.username)
        else:
            flash("Login Unsuccessful","danger")
    return render_template("login.html", form=form)




@app.route("/active",methods=["POST","GET"])
def active():
    print(f"\n\n{current_user.username}\n\n")
    return render_template("buddyroom.html",name=current_user.username)

@socketio.on('message')
def message(msg):
    send(msg,broadcast=True)