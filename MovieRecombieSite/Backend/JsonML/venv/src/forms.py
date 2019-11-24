from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError
from config import mysql
from flask import flash

class RegistrationForm(FlaskForm):
    username = StringField('Username',
                           validators=[DataRequired(), Length(min=2, max=20)])
    email = StringField('Email',
                        validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password',
                                     validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Sign Up')
    def validate_username(self, username):
        cur = mysql.connection.cursor()
        if cur.execute('''SELECT * from login where username=%s''',(username.data,)):
            raise ValidationError("{} is already taken, select another username ".format(username.data))
        mysql.connection.commit()
        cur.close()
    def validate_email(self, email):
        cur = mysql.connection.cursor()
        if cur.execute('''SELECT * from login where email=%s''',(email.data,)):
            raise ValidationError("{} is already registered".format(email.data))
        mysql.connection.commit()
        cur.close()

class LoginForm(FlaskForm):
    username = StringField('Username',
                        validators=[DataRequired(), Length(min=2, max=20)])
    password = PasswordField('Password', validators=[DataRequired()])
    remember = BooleanField('Remember Me')
    submit = SubmitField('Login')