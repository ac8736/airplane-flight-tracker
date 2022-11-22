import pymysql.cursors
import jwt
from flask import request


SECRET_KEY = "secret_key"

def create_connection():
    return pymysql.connect(host='localhost',
                        user='root',
                        password='',
                        db='airline_ticket_reservation',
                        charset='utf8mb4',
                        cursorclass=pymysql.cursors.DictCursor)


def check_authorization():
    if 'Authorization' not in request.headers:
        return "Error"
    token = request.headers['Authorization'].split(" ")[1]
    if not token:
        return "Error"
    try:
        jwt.decode(token, SECRET_KEY, algorithms="HS256")
    except jwt.ExpiredSignatureError:
        return "Error"
    except jwt.DecodeError:
        return "Error"
    return jwt.decode(token, SECRET_KEY, algorithms="HS256")