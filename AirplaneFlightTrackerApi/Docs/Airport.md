# Airport

##### Create Airport Request

```
POST /airport/create
```

```json
{
  "name": "LaGuardia Airport",
  "code": "LGA",
  "city": "NYC",
  "country": "United States of America"
}
```

##### Create Airport Response

```
201 Created
```

```json
{
  "name": "LaGuardia Airport",
  "code": "LGA",
  "city": "NYC",
  "country": "United States of America",
  "dateCreated": "2022-05-02 11:00:00"
}
```

##### Get Airport Request

```
GET /airport/{code}
```

##### Get Airport Response

```
200 Ok
```

```json
{
  "name": "LaGuardia Airport",
  "code": "LGA",
  "city": "NYC",
  "country": "United States of America",
  "dateCreated": "2022-05-02 11:00:00"
}
```

or

```
404 Not Found
```

```json
{
  "message": "Airport was not found."
}
```

##### Delete Airport Request

```
DELETE /airport/{code}
```

##### Delete Airport Response

```
204 No Content
```
