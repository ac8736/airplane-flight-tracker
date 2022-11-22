from config import create_connection
from flask import request, jsonify, Blueprint
from config import SECRET_KEY, check_authorization
import bcrypt
import datetime
import jwt

customer = Blueprint("customer", __name__)

@customer.route("/register-customer", methods=["GET", 'POST'])
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
    token = jwt.encode({'email': new_account["email"], 'role': 'customer', 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, SECRET_KEY, "HS256")
    return jsonify({'status': 'Successfully registered customer.', 'token': token}), 200


@customer.route("/login-customer", methods=["POST"])
def login_customer():
    conn = create_connection()
    user_json = request.json
    cursor = conn.cursor()
    query = "SELECT * FROM customer WHERE email=%s"
    cursor.execute(query, (user_json["email"]))
    user = cursor.fetchone()
    if not user or not bcrypt.checkpw(user_json["password"].encode('utf8'), user['acc_password'].encode("utf8")):
        return jsonify({'status': 'Incorrect Email or Password'}), 403
    token = jwt.encode({'username': user_json["email"], 'role': 'customer', 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, SECRET_KEY, "HS256")
    cursor.close()
    conn.close()
    return jsonify({'status': 'Successfully logged in.', 'token': token}), 200


@customer.route("/cancel-flight", methods=["POST"])
def cancel_flight():
    auth = check_authorization()
    if auth == "Error": return jsonify({'Error': "No token or incorrect token."})
    conn = create_connection()
    cursor = conn.cursor()
    email = auth["username"]
    query = "DELETE FROM ticket WHERE customer_email=%s AND flight_number=%s"
    cursor.execute(query, (email, request.json["flightNumber"]))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'status': 'Successful.'}), 200


@customer.route("/purchase-ticket", methods=["POST"])
def purchase_ticket():
    if check_authorization() == "Error": return jsonify({'Error': "No token or incorrect token."})
    conn = create_connection()
    cursor = conn.cursor()
    payment = request.json
    query = "SELECT * FROM flight WHERE flight_number=%s"
    cursor.execute(query, (payment["id"]))
    flight = cursor.fetchone()
    query = "SELECT COUNT(*) as count FROM ticket"
    cursor.execute(query)
    ticket_id = cursor.fetchone()["count"] + 1
    query = "INSERT INTO ticket VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    cursor.execute(query, (ticket_id, payment["email"], flight["airline"], flight["flight_number"], flight["base_price"], payment["cardNumber"], payment["purchaseDate"], payment["cardType"], payment["cardName"], payment["cardExpiration"]))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'status': 'Successful.'}), 200


@customer.route("/get-tickets", methods=["GET"])
def get_tickets():
    auth = check_authorization()
    if auth == "Error": return jsonify({'Error': "No token or incorrect token."})
    conn = create_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM ticket NATURAL JOIN flight WHERE customer_email=%s"
    cursor.execute(query, (auth["username"]))
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({"tickets": data}), 200


@customer.route("/search-flight", methods=['POST'])
def search_flight():
    auth = check_authorization()
    if auth == "Error": return jsonify({'Error': "No token or incorrect token."})
    conn = create_connection()
    cursor = conn.cursor()
    search = request.json
    query = "SELECT * FROM flight WHERE departure_airport=%s AND arrival_airport=%s AND departure_date_and_time=%s AND arrival_date_and_time=%s"
    cursor.execute(query, (search["departureAirport"], search["arrivalAirport"], search["departureDate"], search["arrivalDate"]))
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'flights': data})
