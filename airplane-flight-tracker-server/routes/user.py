from flask import request, jsonify, Blueprint
import bcrypt, datetime, jwt
from Db import createDb

user = Blueprint('user', __name__)


@user.route('/signin', methods=['POST'])
def signin():
    db = createDb()
    users = db['users']
    json = request.get_json()
    email = json['email']
    username = json['username']
    hashedPw = bcrypt.hashpw(json['password'].encode('utf-8'), bcrypt.gensalt())
    users.insert_one({ 'email': email, 'username': username, 'password': hashedPw, 'saved': [] })
    db.client.close()
    return jsonify({'Message': "Sucessful."}), 200

@user.route('/login', methods=['POST'])
def login():
    db = createDb()
    users = db['users']
    json = request.get_json()
    username = json["username"]
    password = json["password"]
    user = users.find_one({ "username": username })
    db.client.close()
    if bcrypt.checkpw(password.encode('utf-8'), user["password"]):
        token = jwt.encode({"username": username}, "SECRET_KEY", algorithm="HS256")
        return jsonify({"token": token}), 200
    else:
        return jsonify({'Message': "Incorrect password."}), 401

@user.route('/save', methods=['POST'])
def saveFlight():
    db = createDb()
    users = db['users']
    json = request.get_json()
    username = json["username"]
    user = users.find_one({ "username": username })
    saved = user["saved"]
    saved.append(json["flight"])
    users.update_one({ "username": username }, {"$set": {"saved": saved}})
    return jsonify({'Message': "Sucessful."}), 200
