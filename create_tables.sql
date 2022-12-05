# Andy Chen (ac8736)
# Justin Xiong (jx1279)

CREATE DATABASE airline_ticket_reservation;
USE airline_ticket_reservation;

CREATE TABLE customer(
	email	 varchar(30) NOT NULL,
    name 	 varchar(20) NOT NULL,
    acc_password varchar(100) NOT NULL,
    building_number varchar(10) NOT NULL,
    street 	 varchar(10) NOT NULL,
    city	 varchar(10) NOT NULL,
    state	 char(2) NOT NULL,
    phone_number varchar(20) NOT NULL,
    passport_number varchar(15) NOT NULL,
    passport_expiration Date NOT NULL,
    passport_country varchar(20) NOT NULL,
    date_of_birth 	 Date NOT NULL,
    PRIMARY KEY (email)
);

CREATE TABLE airline(
    name varchar(20) NOT NULL,
    PRIMARY KEY (name)
);

CREATE TABLE airport(
	name varchar(20) NOT NULL,
    city varchar(20) NOT NULL,
    country varchar(20) NOT NULL,
    airport_type varchar(20) NOT NULL,
    PRIMARY KEY (name)
);

CREATE TABLE airplane(
    ID	int NOT NULL,
    number_of_seats int NOT NULL,
    manufacturing_company varchar(15) NOT NULL,
    age	int,
    airline varchar(20),
    PRIMARY KEY (ID),
    FOREIGN KEY (airline) REFERENCES airline(name)
);

CREATE TABLE flight(
    flight_number	int NOT NULL,
    departure_date_and_time	Datetime NOT NULL,
    airline		varchar(20) NOT NULL,
    departure_airport  varchar(20) NOT NULL,	
    arrival_airport		varchar(20) NOT NULL,
    arrival_date_and_time	Datetime NOT NULL,
    base_price			int NOT NULL,
    plane_id int NOT NULL,
    flight_status char(7),
    PRIMARY KEY (flight_number, departure_date_and_time),
    FOREIGN KEY (departure_airport) REFERENCES airport(name),
    FOREIGN KEY (arrival_airport) REFERENCES airport(name),
    FOREIGN KEY (airline) REFERENCES airline(name),
    FOREIGN KEY (plane_id) REFERENCES airplane(ID)
);

CREATE TABLE ticket(
    ID 		int NOT NULL AUTO_INCREMENT,
    customer_email varchar(30) NOT NULL,
    airline_name varchar(100) NOT NULL,
    flight_number int NOT NULL,
    purchase_date_and_time Datetime NOT NULL,
    PRIMARY KEY (ID),
    FOREIGN KEY (customer_email) REFERENCES customer(email),
    FOREIGN KEY (flight_number) REFERENCES flight(flight_number)
);
  
CREATE TABLE purchase(
    customer_email varchar(30) NOT NULL,
    ticket_id int NOT NULL,
    card_number char(16) NOT NULL,
    card_type varchar(15) NOT NULL,
    card_name varchar(20) NOT NULL,
    card_expiration Date NOT NULL,
    purchase_date_and_time Datetime NOT NULL,
    sold_price int NOT NULL,
    PRIMARY KEY (customer_email, purchase_date_and_time),
    FOREIGN KEY (customer_email) REFERENCES customer(email),
    FOREIGN KEY (ticket_id) REFERENCES ticket(ID)
);

CREATE TABLE rate(
    email	varchar(30) NOT NULL,
    flight_number	int NOT NULL,
    rating		int NOT NULL,
    comments	varchar(500) NOT NULL,
    PRIMARY KEY (email, flight_number),
    FOREIGN KEY (email) REFERENCES customer(email),
    FOREIGN KEY (flight_number) REFERENCES flight(flight_number)
);
    
CREATE TABLE airline_staff(
    username	  varchar(20) NOT NULL,
    acc_password	varchar(100) NOT NULL,
    firstname	varchar(10) NOT NULL,
    lastname	varchar(10) NOT NULL,
    date_of_birth	Date NOT NULL,
    airline		varchar(20) NOT NULL,
    PRIMARY KEY (username),
    FOREIGN KEY (airline) REFERENCES airline(name)
);

CREATE TABLE airline_staff_email(
    username varchar(20) NOT NULL,
    email varchar(30) NOT NULL,
    CONSTRAINT PRIMARY KEY (username, email),
    FOREIGN KEY (username) REFERENCES airline_staff(username)
);
    
CREATE TABLE airline_staff_number(
  	username varchar(20) NOT NULL,
    phone_number char(10) NOT NULL,
    CONSTRAINT PRIMARY KEY (username, phone_number),
    FOREIGN KEY (username) REFERENCES airline_staff(username)
);