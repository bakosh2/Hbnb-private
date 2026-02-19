from flask_restx import Namespace, Resource, fields
from services import facade

api = Namespace('amenities', description='Amenity operations')

amenity_model = api.model('Amenity', {
    'name': fields.String(required=True, description='Name of the amenity')
})

amenity_response_model = api.model('AmenityResponse', {
    'id': fields.String(description='Amenity ID'),
    'name': fields.String(description='Name of the amenity')
})


@api.route('/')
class AmenityList(Resource):

    @api.expect(amenity_model, validate=True)
    @api.marshal_with(amenity_response_model, code=201)
    def post(self):
        amenity_data = api.payload
        new_amenity = facade.create_amenity(amenity_data)
        return new_amenity, 201


    @api.marshal_list_with(amenity_response_model)
    def get(self):
        return facade.get_all_amenities(), 200


@api.route('/<string:amenity_id>')
class AmenityResource(Resource):

    @api.marshal_with(amenity_response_model)
    def get(self, amenity_id):
        amenity = facade.get_amenity(amenity_id)
        if not amenity:
            api.abort(404, "Amenity not found")
        return amenity


    @api.expect(amenity_model, validate=True)
    @api.marshal_with(amenity_response_model)
    def put(self, amenity_id):
        amenity_data = api.payload
        updated_amenity = facade.update_amenity(amenity_id, amenity_data)
        if not updated_amenity:
            api.abort(404, "Amenity not found")
        return updated_amenity
