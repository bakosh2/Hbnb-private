from flask_restx import Namespace, Resource, fields, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services import facade

# Define the namespace for Amenity operations
api = Namespace('amenities', description='Amenity operations')

# Amenity model for input validation and Swagger documentation
# Using min_length=1 ensures the 'Empty Name' test case returns 400 Bad Request
amenity_model = api.model('Amenity', {
    'name': fields.String(required=True, description='Name of the amenity', min_length=1)
})

# Response model to include the ID and timestamps in the output
amenity_response_model = api.clone('AmenityResponse', amenity_model, {
    'id': fields.String(readOnly=True, description='The amenity unique identifier'),
    'created_at': fields.String(readOnly=True),
    'updated_at': fields.String(readOnly=True)
})

@api.route('/')
class AmenityList(Resource):
    @api.marshal_list_with(amenity_response_model)
    @api.response(200, 'List of amenities retrieved successfully')
    def get(self):
        """Retrieve a list of all amenities"""
        return facade.get_all_amenities(), 200

    @jwt_required()
    @api.expect(amenity_model, validate=True)
    @api.marshal_with(amenity_response_model)
    @api.response(201, 'Amenity successfully created')
    @api.response(400, 'Invalid input data')
    @api.response(403, 'Forbidden')
    def post(self):
        """Create a new amenity"""
        user_id = get_jwt_identity()

        # Only allow admins to create global amenities (adjust policy as needed)
        if not facade.user_is_admin(user_id):
            abort(403, "Only administrators can create amenities")

        amenity_data = api.payload

        try:
            new_amenity = facade.create_amenity(amenity_data, created_by=user_id)
            return new_amenity, 201
        except Exception as e:
            abort(400, str(e))

@api.route('/<amenity_id>')
@api.param('amenity_id', 'The amenity identifier')
@api.response(404, 'Amenity not found')
class AmenityResource(Resource):
    @api.marshal_with(amenity_response_model)
    @api.response(200, 'Amenity details retrieved successfully')
    def get(self, amenity_id):
        """Get amenity details by ID"""
        amenity = facade.get_amenity(amenity_id)
        if not amenity:
            abort(404, "Amenity not found")
        return amenity, 200

    @jwt_required()
    @api.expect(amenity_model, validate=True)
    @api.marshal_with(amenity_response_model)
    @api.response(200, 'Amenity updated successfully')
    @api.response(400, 'Invalid input data')
    @api.response(403, 'Forbidden')
    def put(self, amenity_id):
        """Update an amenity's information"""
        user_id = get_jwt_identity()

        # Ensure amenity exists
        existing = facade.get_amenity(amenity_id)
        if not existing:
            abort(404, "Amenity not found")

        # Allow update only if user is admin or the owner of the amenity
        if not (facade.user_is_admin(user_id) or facade.user_owns_amenity(user_id, amenity_id)):
            abort(403, "You do not have permission to update this amenity")

        amenity_data = api.payload

        updated_amenity = facade.update_amenity(amenity_id, amenity_data, updated_by=user_id)
        if not updated_amenity:
            abort(404, "Amenity not found")

        return updated_amenity, 200
