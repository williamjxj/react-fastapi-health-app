# Json-Server Service

Mock API service using json-server for local development and testing.

## Prerequisites

- Node.js 18+ (LTS version recommended)
- npm 9+

## Setup

```bash
npm install
```

## Development

Start the json-server:

```bash
npm start
```

Or directly:

```bash
json-server --watch db.json --port 3001
```

The API will be available at `http://localhost:3001`.

## API Endpoints

- `GET /patients` - Get all patients
- `POST /patients` - Create a new patient
- `GET /patients/:id` - Get a specific patient
- `PUT /patients/:id` - Update a patient
- `DELETE /patients/:id` - Delete a patient

## Data File

The data is stored in `db.json`. The file structure:

```json
{
  "patients": [
    {
      "id": "1",
      "patientID": "P001",
      "name": "John Doe",
      "age": 45,
      "gender": "Male",
      "medicalCondition": "Hypertension",
      "lastVisit": "2024-01-15"
    }
  ]
}
```

## Configuration

- **Port**: 3001 (default)
- **Data File**: `db.json`

To change the port:

```bash
json-server --watch db.json --port 3002
```

## Usage with Frontend

The frontend can use json-server by setting the environment variable:

```bash
# In frontend/.env
VITE_API_BASE_URL=http://localhost:3001
```

## Notes

- This service is intended for local development only
- Not recommended for production deployment
- Data is stored in-memory and persisted to `db.json` file
- Changes to `db.json` are automatically watched and reloaded

