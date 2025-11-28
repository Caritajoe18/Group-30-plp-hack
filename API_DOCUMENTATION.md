# API Documentation

Base URL: `http://localhost:3000/api`

## SOS Feature

### Trigger SOS Alert
Triggers an immediate SOS alert, saving the location and message to the database.

- **URL**: `/sos`
- **Method**: `POST`
- **Content-Type**: `application/json`

#### Request Body
| Field | Type | Required | Description |
|---|---|---|---|
| `location` | Object | Yes | Object containing `lat` and `lng`. |
| `location.lat` | Number | Yes | Latitude. |
| `location.lng` | Number | Yes | Longitude. |
| `message` | String | No | Distress message. Defaults to "SOS! I need help!". |
| `contactIds` | Array | No | List of contact IDs or phone numbers to notify. |

**Example Request:**
```json
{
  "location": {
    "lat": 12.3456,
    "lng": 78.9012
  },
  "message": "I am in danger, please help!",
  "contactIds": ["+1234567890", "+0987654321"]
}
```

#### Success Response
- **Code**: `201 Created`
- **Content**:
```json
{
  "success": true,
  "data": {
    "location": {
      "lat": 12.3456,
      "lng": 78.9012
    },
    "message": "I am in danger, please help!",
    "status": "active",
    "contactsNotified": ["+1234567890", "+0987654321"],
    "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "createdAt": "2023-09-06T12:00:00.000Z",
    "__v": 0
  },
  "message": "SOS Alert sent successfully"
}
```

#### Error Response
- **Code**: `400 Bad Request`
- **Content**:
```json
{
  "success": false,
  "message": "Location is required"
}
```

### Get All SOS Alerts
Retrieves a list of all SOS alerts, sorted by newest first.

- **URL**: `/sos`
- **Method**: `GET`

#### Success Response
- **Code**: `200 OK`
- **Content**:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "location": { "lat": 12.34, "lng": 56.78 },
      "message": "SOS! I need help!",
      "status": "active",
      "contactsNotified": [],
      "_id": "64f8a...",
      "createdAt": "2023-09-06T12:05:00.000Z"
    },
    {
      "location": { "lat": 10.00, "lng": 20.00 },
      "message": "Help me",
      "status": "resolved",
      "contactsNotified": [],
      "_id": "64f8b...",
      "createdAt": "2023-09-06T11:00:00.000Z"
    }
  ]
}
```
