import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from routes.user import user
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

app.register_blueprint(user)

app.run('localhost', 3000, debug=True)
