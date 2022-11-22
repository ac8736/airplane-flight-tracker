from config import create_connection
from flask import request, jsonify, Blueprint

general = Blueprint("general", __name__)


@general.route("/all-flights", methods=['GET'])
def all_flights():
    conn = create_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM flight"
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'flights': data})


@general.route("/get-airlines", methods=["GET"])
def get_airlines():
    conn = create_connection()
    cursor = conn.cursor()
    query = "SELECT name FROM airline"
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({"airlines": data}), 200


@general.route("/get-airports", methods=["GET"])
def get_airports():
    conn = create_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM airport"
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({"airports": data}), 200