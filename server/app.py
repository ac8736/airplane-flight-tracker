from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql.cursors
import bcrypt
import jwt

app = Flask(__name__)

CORS(app)
conn = pymysql.connect(host='localhost',
                       user='root',
                       password='',
                       db='airline_ticket_reservation',
                       charset='utf8mb4',
                       cursorclass=pymysql.cursors.DictCursor)


@app.route("/all-flights", methods=['GET'])
def all_flights():
    cursor = conn.cursor()
    query = "SELECT * FROM flight"
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()
    return jsonify({'flights': data})


@app.route("/register-customer", methods=["GET", 'POST'])
def register_customer():
    cursor = conn.cursor()
    new_account = request.json
    query = "SELECT * FROM customer WHERE email=%s"
    cursor.execute(query, (new_account["email"]))
    if cursor.fetchone():
        return jsonify({'status': 'Email already in use.'}), 409
    query = "INSERT INTO customer VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    hashed_password = bcrypt.hashpw(new_account["password"].encode('utf8'), bcrypt.gensalt())
    cursor.execute(query, (new_account["email"], new_account["full_name"], hashed_password, new_account["building_number"], 
                           new_account["street"], new_account["city"], new_account["state"], new_account["phone_number"], 
                           new_account["passport_number"], new_account["passport_expiration"], new_account["passport_country"], 
                           new_account["dob"]))
    conn.commit()
    cursor.close()
    return jsonify({'status': 'Successfully registered customer.'}), 200


@app.route("/register-airline-staff", methods=["GET", "POST"])
def register_airline_staff():
    cursor = conn.cursor()
    new_account = request.json
    query = "SELECT * FROM airline_staff WHERE username=%s"
    cursor.execute(query, (new_account["username"]))
    if cursor.fetchone():
        return jsonify({'status': 'User has already been registered.'}), 409
    query = "SELECT * FROM airline WHERE name=%s"
    cursor.execute(query, (new_account["airline"]))
    if not cursor.fetchone():
        return jsonify({'status': 'Airline does not exist.'}), 409
    query = "INSERT INTO airline_staff VALUES(%s, %s, %s, %s, %s, %s)"
    hashed_password = bcrypt.hashpw(new_account["password"].encode('utf8'), bcrypt.gensalt())
    cursor.execute(query, (new_account["username"], hashed_password, new_account["first_name"], 
                           new_account["last_name"], new_account["dob"], new_account["airline"]))
    conn.commit()
    cursor.close()
    return jsonify({'status': 'Successfully registered airline staff'}), 200


@app.route("/login-customer", methods=["POST"])
def login_customer():
    user_json = request.json
    cursor = conn.cursor()
    query = "SELECT * FROM customer WHERE email=%s"
    cursor.execute(query, (user_json["email"]))
    user = cursor.fetchone()
    if not user or not bcrypt.checkpw(user_json["password"].encode('utf8'), user['acc_password'].encode("utf8")):
        return jsonify({'status': 'Incorrect Email or Password'}), 403
    return jsonify({'status': 'Successfully logged in.'}), 200


@app.route("/login-airline-staff", methods=['POST'])
def login_airline_staff():
    user_json = request.json
    cursor = conn.cursor()
    query = "SELECT * FROM airline_staff WHERE username=%s"
    cursor.execute(query, (user_json["username"]))
    user = cursor.fetchone()
    if not user or not bcrypt.checkpw(user_json["password"].encode('utf8'), user['acc_password'].encode('utf8')):
        return jsonify({'status': 'Incorrect Username or Password'}), 403
    return jsonify({'status': 'Successfully logged in.'}), 200


if __name__ == "__main__":
    app.run("127.0.0.1", 5000, debug=True)