from flask_restx import Namespace, Resource, fields
from app.services import facade

api = Namespace('places', description='Place operations')


# ---------- Models ----------
amenity_mini = api.model('AmenityMini', {
    'id': fields.String(description='Amenity ID'),
    'name': fields.String(description='Amenity name'),
})

owner_mini = api.model('OwnerMini', {
    'id': fields.String(description='Owner ID'),
    'first_name': fields.String(description='First name'),
    'last_name': fields.String(description='Last name'),
    'email': fields.String(description='Email'),
})

place_model = api.model('Place', {
    'title': fields.String(required=True, description='Place title'),
    'description': fields.String(description='Place description'),
    'price': fields.Float(required=True, description='Price per night'),
    'latitude': fields.Float(required=True, description='Latitude (-90 to 90)'),
    'longitude': fields.Float(required=True, description='Longitude (-180 to 180)'),
    'owner_id': fields.String(required=True, description='Owner user ID'),
    'amenities': fields.List(fields.String, description='List of amenity IDs'),
})

place_response = api.model('PlaceResponse', {
    'id': fields.String(description='Place ID'),
    'title': fields.String(description='Place title'),
    'description': fields.String(description='Description'),
    'price': fields.Float(description='Price per night'),
    'latitude': fields.Float(description='Latitude'),
    'longitude': fields.Float(description='Longitude'),
    'owner_id': fields.String(description='Owner ID'),
    'owner': fields.Nested(owner_mini, description='Owner details'),
    'amenities': fields.List(fields.Nested(amenity_mini)),
    'created_at': fields.String(description='Creation timestamp'),
    'updated_at': fields.String(description='Update timestamp'),
})


# ---------- Helper ----------
def place_to_dict(place):
    """
    Serialize a place including:
    - Core place fields
    - Owner details
    - Expanded amenities
    """
    data = place.to_dict()

    # Attach owner details
    owner = facade.get_user(place.owner_id)
    data['owner'] = {
        'id': owner.id,
        'first_name': owner.first_name,
        'last_name': owner.last_name,
        'email': owner.email,
    } if owner else None

    # Expand amenities
    data['amenities'] = [
        {'id': amenity.id, 'name': amenity.name}
        for amenity in place.amenities
    ]

    return data


# ---------- Endpoints ----------
@api.route('/')
class PlaceList(Resource):

    @api.response(200, 'List of places retrieved successfully')
    def get(self):
        """Retrieve all places."""
        places = facade.get_all_places()
        return [place_to_dict(place) for place in places], 200

    @api.expect(place_model, validate=True)
    @api.response(201, 'Place created successfully')
    @api.response(400, 'Invalid input data')
    def post(self):
        """Create a new place."""
        data = api.payload

        if not data:
            return {'error': 'No input data provided'}, 400

        if not data.get('title', '').strip():
            return {'error': 'title is required'}, 400

        try:
            place = facade.create_place(data)
            return place_to_dict(place), 201
        except ValueError as e:
            return {'error': str(e)}, 400


@api.route('/<string:place_id>')
class PlaceResource(Resource):

    @api.response(200, 'Place details retrieved successfully')
    @api.response(404, 'Place not found')
    def get(self, place_id):
        """Retrieve a specific place by ID."""
        place = facade.get_place(place_id)
        if not place:
            return {'error': 'Place not found'}, 404

        return place_to_dict(place), 200

    @api.expect(place_model, validate=False)
    @api.response(200, 'Place updated successfully')
    @api.response(400, 'Invalid input data')
    @api.response(404, 'Place not found')
    def put(self, place_id):
        """Update a place."""
        data = api.payload

        if not data:
            return {'error': 'No data provided'}, 400

        try:
            place = facade.update_place(place_id, data)
            if not place:
                return {'error': 'Place not found'}, 404

            return place_to_dict(place), 200
        except ValueError as e:
            return {'error': str(e)}, 400


@api.route('/<string:place_id>/reviews')
class PlaceReviews(Resource):

    @api.response(200, 'Reviews retrieved successfully')
    @api.response(404, 'Place not found')
    def get(self, place_id):
        """Get all reviews for a specific place."""
        place = facade.get_place(place_id)
        if not place:
            return {'error': 'Place not found'}, 404

        reviews = facade.get_reviews_by_place(place_id)
        return [review.to_dict() for review in reviews], 200
