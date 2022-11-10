from flask import Flask, jsonify
from flask_cors import CORS
import pymysql.cursors

app = Flask(__name__)
CORS(app)
conn = pymysql.connect(host='localhost',
                       user='root',
                       password='',
                       db='airline_ticket_reservation',
                       charset='utf8mb4',
                       cursorclass=pymysql.cursors.DictCursor)

@app.route("/", methods=['GET'])
def hello():
    return jsonify({'msg': 'Hello Word'})

@app.route("/testget", methods=['GET'])
def test():
    cursor = conn.cursor()
    query = "SELECT * FROM airline"
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()
    return jsonify({'msg': 'test db data retrieval', 'data': data})

@app.route("/testpost", methods=['POST'])
def post():
    cursor = conn.cursor()
    query = "INSERT INTO airline (name) VALUES('United Airlines')"
    try:
        cursor.execute(query)
        conn.commit()
        cursor.close()
    except:
        return jsonify({'msg': 'unsuccessful'})
    return jsonify({'msg': 'success'})

if __name__ == "__main__":
    app.run("127.0.0.1", 5000, debug=True)