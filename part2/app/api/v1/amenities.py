from flask_restx import Namespace, Resource, fields
from app.services import facade

api = Namespace('amenities', description='Amenity operations')

# ---------- Models ----------
amenity_model = api.model('Amenity', {
    'name': fields.String(required=True, description='Amenity name'),
})

amenity_response = api.model('AmenityResponse', {
    'id':         fields.String(description='Amenity ID'),
    'name':       fields.String(description='Amenity name'),
    'created_at': fields.String(description='Creation timestamp'),
    'updated_at': fields.String(description='Update timestamp'),
})


# ---------- Endpoints ----------
@api.route('/')
class AmenityList(Resource):

    @api.response(200, 'List of amenities retrieved successfully')
    def get(self):
        """Retrieve all amenities."""
        return [a.to_dict() for a in facade.get_all_amenities()], 200

    @api.expect(amenity_model, validate=True)
    @api.response(201, 'Amenity created successfully')
    @api.response(400, 'Invalid input data')
    def post(self):
        """Create a new amenity."""
        data = api.payload
        try:
            amenity = facade.create_amenity(data)
            return amenity.to_dict(), 201
        except ValueError as e:
            return {'error': str(e)}, 400


@api.route('/<string:amenity_id>')
class AmenityResource(Resource):

    @api.response(200, 'Amenity details retrieved successfully')
    @api.response(404, 'Amenity not found')
    def get(self, amenity_id):
        """Get an amenity by ID."""
        amenity = facade.get_amenity(amenity_id)
        if not amenity:
            return {'error': 'Amenity not found'}, 404
        return amenity.to_dict(), 200

    @api.expect(amenity_model, validate=False)
    @api.response(200, 'Amenity updated successfully')
    @api.response(400, 'Invalid input data')
    @api.response(404, 'Amenity not found')
    def put(self, amenity_id):
        """Update an amenity."""
        data = api.payload
        if not data:
            return {'error': 'No data provided'}, 400
        try:
            amenity = facade.update_amenity(amenity_id, data)
            if not amenity:
                return {'error': 'Amenity not found'}, 404
            return amenity.to_dict(), 200
        except ValueError as e:
            return {'error': str(e)}, 400
