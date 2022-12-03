from config import create_connection
from flask import request, jsonify, Blueprint
from config import SECRET_KEY, check_authorization
import bcrypt, datetime, jwt

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
    token = jwt.encode({'email': user_json["email"], 'role': 'customer', 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, SECRET_KEY, "HS256")
    cursor.close()
    conn.close()
    return jsonify({'status': 'Successfully logged in.', 'token': token}), 200


@customer.route("/cancel-flight", methods=["POST"])
def cancel_flight():
    auth = check_authorization()
    if auth == "Error": return jsonify({'Error': "No token or incorrect token."}), 403
    conn = create_connection()
    cursor = conn.cursor()
    email = auth["email"]
    query = "DELETE FROM purchase WHERE customer_email=%s AND purchase_date_and_time=%s AND ticket_id=%s"
    cursor.execute(query, (email, request.json["purchase_date_and_time"], request.json["ticketID"]))
    query = "DELETE FROM ticket WHERE ID=%s"
    cursor.execute(query, (request.json["ticketID"]))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'status': 'Successful.'}), 200


@customer.route("/purchase-ticket", methods=["POST"])
def purchase_ticket():
    auth = check_authorization()
    if auth == "Error": return jsonify({'Error': "No token or incorrect token."}), 403
    conn = create_connection()
    cursor = conn.cursor()
    payment = request.json
    query = "SELECT * FROM flight WHERE flight_number=%s"
    cursor.execute(query, (payment["id"]))
    flight = cursor.fetchone()
    query = "INSERT INTO ticket(customer_email, airline_name, flight_number, purchase_date_and_time) VALUES(%s, %s, %s, %s)"
    cursor.execute(query, (auth["email"], flight["airline"], flight["flight_number"], payment["purchaseDate"]))
    conn.commit()
    query = "SELECT ID FROM ticket WHERE customer_email=%s AND airline_name=%s AND flight_number=%s AND purchase_date_and_time=%s"
    print(query % (auth["email"], flight["airline"], flight["flight_number"], payment["purchaseDate"]))
    cursor.execute(query, (auth["email"], flight["airline"], flight["flight_number"], payment["purchaseDate"]))
    ticket_id = cursor.fetchone()
    print(ticket_id)
    query = "INSERT INTO purchase VALUES(%s,%s,%s,%s,%s,%s,%s,%s)"
    cursor.execute(query, (auth["email"], ticket_id["ID"], payment["cardNumber"], 
                           payment["cardType"], payment["cardName"], payment["cardExpiration"], 
                           payment["purchaseDate"], flight["base_price"]))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'status': 'Successful.'}), 200


@customer.route("/get-tickets", methods=["GET"])
def get_tickets():
    auth = check_authorization()
    if auth == "Error": return jsonify({'Error': "No token or incorrect token."}), 403
    conn = create_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM ticket NATURAL JOIN flight WHERE customer_email=%s"
    cursor.execute(query, (auth["email"]))
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({"tickets": data}), 200


@customer.route("/search-flight", methods=['POST'])
def search_flight():
    auth = check_authorization()
    if auth == "Error": return jsonify({'Error': "No token or incorrect token."}), 403
    conn = create_connection()
    cursor = conn.cursor()
    search = request.json
    query = "SELECT * FROM flight WHERE departure_airport=%s AND arrival_airport=%s AND departure_date_and_time=%s AND arrival_date_and_time=%s"
    cursor.execute(query, (search["departureAirport"], search["arrivalAirport"], search["departureDate"], search["arrivalDate"]))
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'flights': data})


@customer.route("/track-spending", methods=["GET"])
def track_spending():
    auth = check_authorization()
    if auth == "Error": return jsonify({'Error': "No token or incorrect token."}), 403
    conn = create_connection()
    cursor = conn.cursor()
    query = "SELECT ticket_id, purchase_date_and_time, sold_price, SUM(sold_price) AS total FROM purchase WHERE customer_email=%s"
    cursor.execute(query, (auth["email"]))
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'purchases': data})


@customer.route("/rate-flights", methods=["POST"])
def rate_flights():
    auth = check_authorization()
    if auth == "Error": return jsonify({'Error': "No token or incorrect token."}), 403
    conn = create_connection()
    cursor = conn.cursor()
    rating = request.json
    query = "INSERT INTO rate VALUES(%s, %s, %s, %s)"
    cursor.execute(query, (auth["email"], rating["flightNum"], rating["star"], rating["comment"]))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'status': 'Successful.'}), 200
