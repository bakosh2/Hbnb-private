# HBnB - Part 2: Business Logic and API Endpoints

## Overview

HBnB is a RESTful API application built with Flask and flask-restx. This part implements the Presentation and Business Logic layers, including CRUD operations for Users, Places, Reviews, and Amenities using an in-memory repository and the Facade design pattern.

---

## Project Structure

```
part2/
├── app/
│   ├── __init__.py            # Flask app factory
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py    # Blueprint + namespaces
│   │       ├── users.py       # User endpoints
│   │       ├── places.py      # Place endpoints
│   │       ├── reviews.py     # Review endpoints
│   │       └── amenities.py   # Amenity endpoints
│   ├── models/
│   │   ├── __init__.py
│   │   ├── base_model.py      # Base class (id, timestamps)
│   │   ├── user.py
│   │   ├── place.py
│   │   ├── review.py
│   │   └── amenity.py
│   ├── services/
│   │   ├── __init__.py        # Shared facade singleton
│   │   └── facade.py          # HBnBFacade (business logic)
│   └── persistence/
│       ├── __init__.py
│       └── repository.py      # InMemoryRepository
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_facade.py
│   └── test_api_users.py
├── run.py
├── config.py
├── requirements.txt
└── README.md
```

---

## Installation

```bash
pip install -r requirements.txt
```

---

## Running the Application

```bash
python run.py
```

- API base URL: `http://localhost:5000/api/v1/`
- Swagger UI: `http://localhost:5000/api/v1/`

---

## API Endpoints

### Users `/api/v1/users/`

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| POST | `/api/v1/users/` | Create user | 201, 400 |
| GET | `/api/v1/users/` | List all users | 200 |
| GET | `/api/v1/users/<id>` | Get user by ID | 200, 404 |
| PUT | `/api/v1/users/<id>` | Update user | 200, 400, 404 |

> Password is **never** returned in responses.

### Amenities `/api/v1/amenities/`

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| POST | `/api/v1/amenities/` | Create amenity | 201, 400 |
| GET | `/api/v1/amenities/` | List all amenities | 200 |
| GET | `/api/v1/amenities/<id>` | Get amenity by ID | 200, 404 |
| PUT | `/api/v1/amenities/<id>` | Update amenity | 200, 400, 404 |

### Places `/api/v1/places/`

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| POST | `/api/v1/places/` | Create place | 201, 400 |
| GET | `/api/v1/places/` | List all places | 200 |
| GET | `/api/v1/places/<id>` | Get place (with owner + amenities) | 200, 404 |
| PUT | `/api/v1/places/<id>` | Update place | 200, 400, 404 |
| GET | `/api/v1/places/<id>/reviews` | Get all reviews for a place | 200, 404 |

### Reviews `/api/v1/reviews/`

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| POST | `/api/v1/reviews/` | Create review | 201, 400 |
| GET | `/api/v1/reviews/` | List all reviews | 200 |
| GET | `/api/v1/reviews/<id>` | Get review by ID | 200, 404 |
| PUT | `/api/v1/reviews/<id>` | Update review | 200, 400, 404 |
| DELETE | `/api/v1/reviews/<id>` | Delete review | 200, 404 |

---

## Validation Rules

| Field | Rule |
|-------|------|
| `email` | Valid format; unique across all users |
| `price` | Must be ≥ 0 |
| `latitude` | Between -90.0 and 90.0 |
| `longitude` | Between -180.0 and 180.0 |
| `rating` | Integer between 1 and 5 |
| `text` | Non-empty string |

---

## Running Tests

```bash
# Unit tests (models + facade)
python3 -m unittest tests/test_models.py tests/test_facade.py -v

# API integration tests
python3 -m unittest tests/test_api_users.py -v

# All tests
python3 -m unittest discover -s tests -v

# Manual tests
python tests_manual.py
```

---

## cURL Examples

```bash
# Create a user
curl -X POST http://localhost:5000/api/v1/users/ \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe","email":"john@example.com","password":"secret"}'

# Create an amenity
curl -X POST http://localhost:5000/api/v1/amenities/ \
  -H "Content-Type: application/json" \
  -d '{"name":"WiFi"}'

# Create a place
curl -X POST http://localhost:5000/api/v1/places/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Beach House","description":"Lovely","price":120.0,"latitude":36.7,"longitude":3.0,"owner_id":"<USER_ID>"}'

# Create a review
curl -X POST http://localhost:5000/api/v1/reviews/ \
  -H "Content-Type: application/json" \
  -d '{"text":"Amazing!","rating":5,"user_id":"<USER_ID>","place_id":"<PLACE_ID>"}'

# Delete a review
curl -X DELETE http://localhost:5000/api/v1/reviews/<REVIEW_ID>
```
