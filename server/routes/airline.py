from flask import request, jsonify, Blueprint
from config import check_authorization
from config import create_connection
import bcrypt, datetime, jwt
from config import SECRET_KEY

airline = Blueprint('airline', __name__)

@airline.route("/flights-by-airline", methods=['GET'])
def flights_by_airline():
    auth = check_authorization()
    if auth == "Error": return jsonify({'Error': "No token or incorrect token."})
    conn = create_connection()
    cursor = conn.cursor()
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


@airline.route("/change-flight-status", methods=['POST'])
def change_flight_status():
    auth = check_authorization()
    if auth == "Error": return jsonify({'Error': "No token or incorrect token."})
    conn = create_connection()
    cursor = conn.cursor()
    query = "UPDATE flight SET flight_status=%s WHERE flight_number=%s"
    cursor.execute(query, (request.json['status'], request.json['flightNumber']))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'status': 'Flight status updated.'}), 200


@airline.route("/register-airline-staff", methods=["GET", "POST"])
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
    token = jwt.encode({'username': new_account['username'], 'role': 'airline-staff', 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, SECRET_KEY, "HS256")
    return jsonify({'status': 'Successfully registered airline staff', 'token': token}), 200


@airline.route("/login-airline-staff", methods=['POST'])
def login_airline_staff():
    conn = create_connection()
    user_json = request.json
    cursor = conn.cursor()
    query = "SELECT * FROM airline_staff WHERE username=%s"
    cursor.execute(query, (user_json["username"]))
    user = cursor.fetchone()
    if not user or not bcrypt.checkpw(user_json["password"].encode('utf8'), user['acc_password'].encode('utf8')):
        return jsonify({'status': 'Incorrect Username or Password'}), 403
    token = jwt.encode({'username': user_json["username"], 'role': 'airline-staff', 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, SECRET_KEY, "HS256")
    cursor.close()
    conn.close()
    return jsonify({'status': 'Successfully logged in.', "token": token}), 200


@airline.route("/add-airplane", methods=["POST"])
def add_airplane():
    auth = check_authorization()
    if auth == "Error": return jsonify({'Error': "No token or incorrect token."})
    conn = create_connection()
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


@airline.route("/get-airplanes")
def get_airplanes():
    auth = check_authorization()
    if auth == "Error": return jsonify({'Error': "No token or incorrect token."})
    conn = create_connection()
    cursor = conn.cursor()
    query = "SELECT airline FROM airline_staff WHERE username=%s"
    cursor.execute(query, (auth["username"]))
    airline = cursor.fetchone()['airline']
    query = "SELECT * FROM airplane WHERE airline=%s"
    cursor.execute(query, (airline))
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({"airplanes": data}), 200


@airline.route("/add-airport", methods=["POST"])
def add_airport():
    auth = check_authorization()
    if auth == "Error": return jsonify({'Error': "No token or incorrect token."})
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


@airline.route("/add-flight", methods=["POST"])
def add_flight():
    auth = check_authorization()
    if auth == "Error": return jsonify({'Error': "No token or incorrect token."})
    conn = create_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM flight WHERE flight_number=%s AND departure_date_and_time=%s"
    cursor.execute(query, (request.json["flightNumber"], request.json["departureDateTime"]))
    if cursor.fetchone():
        return jsonify({'status': 'Flight already exists.'}), 403
    query = "SELECT airline FROM airline_staff WHERE username=%s"
    cursor.execute(query, (auth["username"]))
    airline = cursor.fetchone()['airline']
    flight_data = request.json
    query = "INSERT INTO flight VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s)"
    cursor.execute(query, (flight_data["flightNumber"], flight_data["departureDateTime"], airline, flight_data["departureAirport"], flight_data["arrivalAirport"], flight_data["arrivalDateTime"], flight_data["basePrice"], flight_data["plane"], "On-time"))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'status': 'Successful.'}), 200


@airline.route("/revenue", methods=["POST"])
def get_earned_revenue():
    auth = check_authorization()
    if auth == "Error": return jsonify({'Error': "No token or incorrect token."}), 403
    conn = create_connection()
    cursor = conn.cursor()
    query = "SELECT airline FROM airline_staff WHERE username=%s"
    cursor.execute(query, (auth["username"]))
    airline = cursor.fetchone()['airline']
    if request.json['time'] == 'month':
        query = "SELECT SUM(sold_price) as revenue FROM `purchase` INNER JOIN ticket ON ticket.ID=purchase.ticket_id WHERE airline_name=%s AND purchase.purchase_date_and_time >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)"
        cursor.execute(query, (airline))
    else:
        query = "SELECT SUM(sold_price) as revenue FROM `purchase` INNER JOIN ticket ON ticket.ID=purchase.ticket_id WHERE airline_name=%s AND purchase.purchase_date_and_time >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)"
        cursor.execute(query, (airline))
    data = cursor.fetchone()
    cursor.close()
    conn.close()
    return jsonify({'revenue': data}), 200


@airline.route("/customer-reports", methods=["GET"])
def get_customer_reports():
    auth = check_authorization()
    if auth == "Error": return jsonify({'Error': "No token or incorrect token."}), 403
    conn = create_connection()
    cursor = conn.cursor()
    query = "SELECT customer_email FROM ticket WHERE purchase_date_and_time >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) GROUP BY customer_email HAVING COUNT(*) IN (SELECT MAX(customers) FROM (SELECT COUNT(*) AS customers FROM ticket GROUP BY customer_email) AS result)"
    cursor.execute(query)
    most_frequent_customer = cursor.fetchone()
    query = "SELECT airline FROM airline_staff WHERE username=%s"
    cursor.execute(query, (auth["username"]))
    airline = cursor.fetchone()['airline']
    query = "SELECT DISTINCT customer_email FROM ticket WHERE airline_name=%s"
    cursor.execute(query, (airline))
    customers_by_airline = cursor.fetchall()
    return jsonify({'most_frequent_customer': most_frequent_customer, 'customers_by_airline': customers_by_airline}), 200


@airline.route("/customer-flights/<customer>", methods=["GET"])
def customer_flights(customer):
    auth = check_authorization()
    if auth == "Error": return jsonify({'Error': 'No token or incorrect token.'}), 403
    conn = create_connection()
    cursor = conn.cursor()
    query = "SELECT airline FROM airline_staff WHERE username=%s"
    cursor.execute(query, (auth["username"]))
    airline = cursor.fetchone()['airline']
    query = "SELECT * FROM ticket NATURAL JOIN flight WHERE customer_email=%s AND airline_name=%s"
    cursor.execute(query, (customer, airline))
    data = cursor.fetchall()
    return jsonify({'customer_flights': data}), 200


@airline.route("/get-flight-ratings/<flight_number>", methods=["GET"])
def get_flight_ratings(flight_number):
    auth = check_authorization()
    if auth == "Error": return jsonify({'Error': 'No token or incorrect token.'}), 403
    conn = create_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM rate WHERE flight_number=%s"
    cursor.execute(query, (airline, flight_number))
    data = cursor.fetchall()
    return jsonify({'flight_ratings': data}), 200