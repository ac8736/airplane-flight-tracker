from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql.cursors
import bcrypt
from functools import wraps
import jwt
import datetime

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret_key"
CORS(app)

def create_connection():
    return pymysql.connect(host='localhost',
                        user='root',
                        password='',
                        db='airline_ticket_reservation',
                        charset='utf8mb4',
                        cursorclass=pymysql.cursors.DictCursor)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers['Authorization']
        token = token.split(" ")[1]
        if not token:
            return jsonify({"Error": "Token is missing."})
        try:
            jwt.decode(token, app.config['SECRET_KEY'], algorithms="HS256")
        except jwt.ExpiredSignatureError:
            return jsonify({'Error': 'Expired token.'})
        except jwt.DecodeError:
            return jsonify({'Error': 'Invalid token.'})
        return f(*args, **kwargs)
    return decorated


@app.route("/all-flights", methods=['GET'])
def all_flights():
    conn = create_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM flight"
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'flights': data})

@token_required
@app.route("/flights-by-airline", methods=['GET'])
def flights_by_airline():
    conn = create_connection()
    cursor = conn.cursor()
    auth = request.headers['Authorization'].split(" ")[1]
    auth = jwt.decode(auth, app.config['SECRET_KEY'], algorithms="HS256")
    query = "SELECT * FROM airline_staff WHERE username=%s"
    cursor.execute(query, auth['username'])
    data = cursor.fetchone()
    airline = data['airline']
    query = "SELECT * FROM flight WHERE airline=%s"
    cursor.execute(query, (airline))
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'flights': data})


@token_required
@app.route("/change-flight-status", methods=['POST'])
def change_flight_status():
    conn = create_connection()
    cursor = conn.cursor()
    query = "UPDATE flight SET flight_status=%s WHERE flight_number=%s"
    cursor.execute(query, (request.json['status'], request.json['flightNumber']))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'status': 'Flight status updated.'}), 200


@app.route("/get-airlines", methods=["GET"])
def get_airlines():
    conn = create_connection()
    cursor = conn.cursor()
    query = "SELECT name FROM airline"
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({"airlines": data}), 200


@app.route("/register-customer", methods=["GET", 'POST'])
def register_customer():
    conn = create_connection()
    cursor = conn.cursor()
    new_account = request.json
    query = "SELECT * FROM customer WHERE email=%s"
    cursor.execute(query, (new_account["email"]))
    if cursor.fetchone():
        return jsonify({'status': 'Email already in use.'}), 409
    query = "INSERT INTO customer VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    hashed_password = bcrypt.hashpw(new_account["password"].encode('utf8'), bcrypt.gensalt())
    cursor.execute(query, (new_account["email"], new_account["fullName"], hashed_password, new_account["buildingNumber"], 
                           new_account["street"], new_account["city"], new_account["state"], new_account["phoneNumber"], 
                           new_account["passportNumber"], new_account["passportExpiration"], new_account["passportCountry"], 
                           new_account["dob"]))
    conn.commit()
    cursor.close()
    conn.close()
    token = jwt.encode({'email': new_account["email"], 'role': 'customer', 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, app.config['SECRET_KEY'], "HS256")
    return jsonify({'status': 'Successfully registered customer.', 'token': token}), 200


@app.route("/register-airline-staff", methods=["GET", "POST"])
def register_airline_staff():
    conn = create_connection()
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
    cursor.execute(query, (new_account["username"], hashed_password, new_account["firstName"], 
                           new_account["lastName"], new_account["dob"], new_account["airline"]))
    conn.commit()
    cursor.close()
    conn.close()
    token = jwt.encode({'username': new_account['username'], 'role': 'airline-staff', 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, app.config['SECRET_KEY'], "HS256")
    return jsonify({'status': 'Successfully registered airline staff', 'token': token}), 200


@app.route("/login-customer", methods=["POST"])
def login_customer():
    conn = create_connection()
    user_json = request.json
    cursor = conn.cursor()
    query = "SELECT * FROM customer WHERE email=%s"
    cursor.execute(query, (user_json["email"]))
    user = cursor.fetchone()
    if not user or not bcrypt.checkpw(user_json["password"].encode('utf8'), user['acc_password'].encode("utf8")):
        return jsonify({'status': 'Incorrect Email or Password'}), 403
    token = jwt.encode({'username': user_json["email"], 'role': 'customer', 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, app.config['SECRET_KEY'], "HS256")
    cursor.close()
    conn.close()
    return jsonify({'status': 'Successfully logged in.', 'token': token}), 200


@app.route("/login-airline-staff", methods=['POST'])
def login_airline_staff():
    conn = create_connection()
    user_json = request.json
    cursor = conn.cursor()
    query = "SELECT * FROM airline_staff WHERE username=%s"
    cursor.execute(query, (user_json["username"]))
    user = cursor.fetchone()
    if not user or not bcrypt.checkpw(user_json["password"].encode('utf8'), user['acc_password'].encode('utf8')):
        return jsonify({'status': 'Incorrect Username or Password'}), 403
    token = jwt.encode({'username': user_json["username"], 'role': 'airline-staff', 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, app.config['SECRET_KEY'], "HS256")
    cursor.close()
    conn.close()
    return jsonify({'status': 'Successfully logged in.', "token": token}), 200


# @token_required
# @app.route("/airline-staff-flights", methods=["GET"])
# def airline_staff_flights():
#     auth = request.headers['Authorization'].split(" ")[1]
#     auth = jwt.decode(auth, app.config['SECRET_KEY'], algorithms="HS256")
#     cursor = conn.cursor()
#     print(auth, request.json)
#     return jsonify({'status': 'Successful.'}), 200


@token_required
@app.route("/add-airplane", methods=["POST"])
def add_airplane():
    conn = create_connection()
    auth = request.headers['Authorization'].split(" ")[1]
    auth = jwt.decode(auth, app.config['SECRET_KEY'], algorithms="HS256")
    cursor = conn.cursor()
    airplane_data = request.json
    query = "SELECT * FROM airplane WHERE id=%s"
    cursor.execute(query, (airplane_data["id"]))
    if cursor.fetchone():
        return jsonify({'status': "Airplane ID already exists."}), 403
    query = "SELECT airline FROM airline_staff WHERE username=%s"
    cursor.execute(query, (auth["username"]))
    airline = cursor.fetchone()['airline']
    query = "INSERT INTO airplane VALUES(%s, %s, %s, %s, %s)"
    cursor.execute(query, (airplane_data["id"], airplane_data["numOfSeats"], airplane_data["manufacturer"], airplane_data["age"], airline))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'status': 'Successful.'}), 200


@token_required
@app.route("/get-airplanes")
def get_airplanes():
    conn = create_connection()
    cursor = conn.cursor()
    auth = request.headers['Authorization'].split(" ")[1]
    auth = jwt.decode(auth, app.config['SECRET_KEY'], algorithms="HS256")
    query = "SELECT airline FROM airline_staff WHERE username=%s"
    cursor.execute(query, (auth["username"]))
    airline = cursor.fetchone()['airline']
    query = "SELECT * FROM airplane WHERE airline=%s"
    cursor.execute(query, (airline))
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({"airplanes": data}), 200


@app.route("/get-airports", methods=["GET"])
def get_airports():
    conn = create_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM airport"
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({"airports": data}), 200


@token_required
@app.route("/add-airport", methods=["POST"])
def add_airport():
    conn = create_connection()
    cursor = conn.cursor()
    airport_data = request.json
    query = "SELECT * FROM airport WHERE name=%s"
    cursor.execute(query, (airport_data["name"]))
    if cursor.fetchone():
        return jsonify({'status': 'Airport already exists.'}), 403
    query = "INSERT INTO airport VALUES(%s, %s, %s, %s)"
    cursor.execute(query, (airport_data["name"], airport_data["city"], airport_data["country"], airport_data["airportType"]))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'status': 'Successful.'}), 200


@token_required
@app.route("/add-flight", methods=["POST"])
def add_flight():
    conn = create_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM flight WHERE flight_number=%s AND departure_date_and_time=%s"
    cursor.execute(query, (request.json["flightNumber"], request.json["departureDateTime"]))
    if cursor.fetchone():
        return jsonify({'status': 'Flight already exists.'}), 403
    auth = request.headers['Authorization'].split(" ")[1]
    auth = jwt.decode(auth, app.config['SECRET_KEY'], algorithms="HS256")
    query = "SELECT airline FROM airline_staff WHERE username=%s"
    cursor.execute(query, (auth["username"]))
    airline = cursor.fetchone()['airline']
    flight_data = request.json
    print(flight_data)
    query = "INSERT INTO flight VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s)"
    cursor.execute(query, (flight_data["flightNumber"], flight_data["departureDateTime"], airline, flight_data["departureAirport"], flight_data["arrivalAirport"], flight_data["arrivalDateTime"], flight_data["basePrice"], flight_data["plane"], "On-time"))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'status': 'Successful.'}), 200

if __name__ == "__main__":
    app.run("127.0.0.1", 5000, debug=True)