from flask import Flask, jsonify
import pymysql.cursors

app = Flask(__name__)

@app.route("/")
def hello():
    return jsonify({'msg': 'Hello Word'})

@app.route("/test")
def test():
    return jsonify({'msg': 'test'})

if __name__ == "__main__":
    app.run("127.0.0.1", 5000, debug=True)