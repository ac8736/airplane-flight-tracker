from flask import Flask, jsonify, request
from flask_cors import CORS

from routes.airline import airline
from routes.general import general
from routes.customer import customer

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret_key"

app.register_blueprint(airline)
app.register_blueprint(general)
app.register_blueprint(customer)

CORS(app)

if __name__ == "__main__":
    app.run("127.0.0.1", 5000, debug=True)
