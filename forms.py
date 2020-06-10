from flask_wtf import FlaskForm
from wtforms import StringField,PasswordField,SubmitField
from wtforms.validators import DataRequired,Length,Email

class SignUpForm(FlaskForm):
    name=StringField("Name",
        validators=[DataRequired(),Length(min=2, max=20)])
    submit=SubmitField('Create Account')



class LoginForm(FlaskForm):
    email=StringField('Email',validators=[DataRequired(),Email()])
    submit=SubmitField('Confirm')