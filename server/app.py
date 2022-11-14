from flask import Flask, jsonify, request, session
from flask_cors import CORS
import pymysql.cursors
import bcrypt

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
    full_name = request.json["fullName"]
    email = request.json['email']
    password = request.json['password']
    dob = request.json['dob']
    phone_number = request.json["phoneNumber"]
    building_number = request.json['buildingNumber']
    street = request.json['street']
    city = request.json['city']
    state = request.json['state']
    passport_number = request.json['passportNumber']
    passport_expiration = request.json['passportExpiration']
    passport_country = request.json['passportCountry']
    query = "SELECT * FROM customer WHERE email=%s"
    cursor.execute(query, (email))
    user = cursor.fetchone()
    if user:
        return jsonify({'status': 'Email already in use.'}), 409
    query = "INSERT INTO customer VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    password = bcrypt.hashpw(password.encode('utf8'), bcrypt.gensalt())
    cursor.execute(query, (email, full_name, password, building_number, street, city, state, phone_number, passport_number, passport_expiration, passport_country, dob))
    conn.commit()
    cursor.close()
    session['username'] = email
    return jsonify({'status': 'Successfully registered customer.'}), 200


@app.route("/register-airline-staff", methods=["GET", "POST"])
def register_airline_staff():
    cursor = conn.cursor()
    username = request.json["username"]
    password = request.json["password"]
    first_name = request.json["firstName"]
    last_name = request.json["lastName"]
    dob = request.json["dob"]
    airline = request.json["airline"]
    query = "SELECT * FROM airline_staff WHERE username=%s"
    cursor.execute(query, (username))
    user = cursor.fetchone()
    if user:
        return jsonify({'status': 'User has already been registered.'}), 409
    query = "SELECT * FROM airline WHERE name=%s"
    cursor.execute(query, (airline))
    airline_exist = cursor.fetchone()
    if not airline_exist:
        return jsonify({'status': 'Airline does not exist.'}), 409
    query = "INSERT INTO airline_staff VALUES(%s, %s, %s, %s, %s, %s)"
    password = bcrypt.hashpw(password.encode('utf8'), bcrypt.gensalt())
    cursor.execute(query, (username, password, first_name, last_name, dob, airline))
    conn.commit()
    cursor.close()
    session['username'] = username
    return jsonify({'status': 'Successfully registered airline staff'}), 200


app.secret_key = 'sdknljdghdhdsDhd1445GKse6g6hfL7f3f8s11s33788sJS'
if __name__ == "__main__":
    app.run("127.0.0.1", 5000, debug=True)