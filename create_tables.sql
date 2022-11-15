# Andy Chen (ac8736)
# Justin Xiong (jx1279)

CREATE TABLE customer(
	email	 varchar(30),
    name 	 varchar(20),
    acc_password varchar(20),
    building_number varchar(10),
    street 	 varchar(10),
    city	 varchar(10),
    state	 char(2),
    phone_number char(10),
    passport_number varchar(15),
    passport_expiration Date,
    passport_country varchar(20),
    date_of_birth 	 Date,
    PRIMARY KEY (email)
);

CREATE TABLE airline(
    name varchar(20),
    PRIMARY KEY (name)
);

CREATE TABLE airport(
	name varchar(20),
    city varchar(20),
    country varchar(20),
    airport_type varchar(20),
    PRIMARY KEY (name)
);

CREATE TABLE airplane(
    ID	int,
    number_of_seats int,
    manufacturing_company varchar(15),
    age	int,
    airline varchar(20),
    PRIMARY KEY (ID)
);

CREATE TABLE flight(
    flight_number	int,
    departure_date_and_time	Datetime,
    airline		varchar(20),
    departure_airport  varchar(20),	
    arrival_airport		varchar(20),
    arrival_date_and_time	Datetime,
    base_price			int,
    plane_id int,
    PRIMARY KEY (flight_number, departure_date_and_time),
    FOREIGN KEY (departure_airport) REFERENCES airport(name),
    FOREIGN KEY (arrival_airport) REFERENCES airport(name),
    FOREIGN KEY (airline) REFERENCES airline(name),
    FOREIGN KEY (plane_id) REFERENCES airplane(ID)
);

CREATE TABLE ticket(
    ID 		char(9),
    customer_email varchar(30),
    airline_name varchar(10),
    flight_number int,
    sold_price int,
    PRIMARY KEY (ID),
    FOREIGN KEY (flight_number) REFERENCES flight(flight_number)
);

CREATE TABLE purchase(
    email varchar(30),
    ID char(9),
    card_number char(16),
    purchase_date_and_time Datetime,
    card_type varchar(15),
    card_name varchar(20),
    card_expiration Date,
    PRIMARY KEY (ID),
    FOREIGN KEY (email) REFERENCES customer(email),
    FOREIGN KEY (ID) REFERENCES ticket(ID)
);
  
CREATE TABLE rate(
    email	varchar(30),
    flight_number	int,
    rating		int,
    comments	varchar(500),
    PRIMARY KEY (email, flight_number),
    FOREIGN KEY (email) REFERENCES customer(email),
    FOREIGN KEY (flight_number) REFERENCES flight(flight_number)
);
    
CREATE TABLE airline_staff(
    username	  varchar(20),
    acc_password	varchar(20),
    firstname	varchar(10),
    lastname	varchar(10),
    date_of_birth	Date,
    airline		varchar(20),
    PRIMARY KEY (username),
    FOREIGN KEY (airline) REFERENCES airline(name)
);

CREATE TABLE airline_staff_email(
    username varchar(20),
    email varchar(30),
    PRIMARY KEY(email),
    FOREIGN KEY (username) REFERENCES airline_staff(username)
);
    
CREATE TABLE airline_staff_number(
  	username varchar(20),
    phone_number char(10),
    PRIMARY KEY (phone_number),
    FOREIGN KEY (username) REFERENCES airline_staff(username)
);