from flask_wtf import FlaskForm
from wtforms import StringField,PasswordField,SubmitField,BooleanField
from wtforms.validators import DataRequired,Length,Email,ValidationError
from application.models import User


class SignUpForm(FlaskForm):
    name=StringField("Name",
        validators=[DataRequired(),Length(min=2, max=20)])
    email=StringField("Email",validators=[DataRequired(),Email()])
    password=PasswordField('Password',validators=[DataRequired(),Length(min=6)])
    submit=SubmitField('Create Account')

    def validate_name(self,name):
        user=User.query.filter_by(username=name.data).first()
        if user:
            raise ValidationError('Username Taken')
    def validate_email(self,email):
        user=User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('email already exist')



class LoginForm(FlaskForm):
    name=StringField("Name",
        validators=[DataRequired(),Length(min=2, max=20)])
    remember=BooleanField("Remember Me")
    submit=SubmitField('Enter Workspace')