# Airline Staff

##### Create Airline Staff Request

```
POST /airline-staff/create
```

```json
{
  "username": "johndoe123",
  "email": "abc@mail.com",
  "password": "123",
  "first_name": "John",
  "last_name": "Doe",
  "birth_date": "2022-02-02",
  "airline": "United Airlines"
}
```

##### Create Airline Response

```
201 Created
```

```json
{
  "guid": "00-00-00",
  "username": "johndoe123",
  "date_created": "2022-02-02 11:00:00"
}
```

##### Update Airline Staff Request

```
PUT /airline-staff/update/{guid}
```

```json
{
  "username": "johndoe123",
  "email": "abc@mail.com",
  "password": "123",
  "first_name": "John",
  "last_name": "Doe",
  "birth_date": "2022-02-02",
  "airline": "United Airlines"
}
```

##### Update Airline Response

```
204 No Content
```

##### Delete Airline Request

```
DELETE /airline-staff/delete/{guid}
```

##### Delete Airline Response

```
204 No Content
```
