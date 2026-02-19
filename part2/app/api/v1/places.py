from flask_restx import Namespace, Resource, fields
from services import facade

api = Namespace('places', description='Place operations')

amenity_model = api.model('PlaceAmenity', {
    'id': fields.String,
    'name': fields.String
})

user_model = api.model('PlaceUser', {
    'id': fields.String,
    'first_name': fields.String,
    'last_name': fields.String,
    'email': fields.String
})

place_model = api.model('Place', {
    'title': fields.String(required=True),
    'description': fields.String,
    'price': fields.Float(required=True),
    'latitude': fields.Float(required=True),
    'longitude': fields.Float(required=True),
    'owner_id': fields.String(required=True),
    'amenities': fields.List(fields.String)
})


@api.route('/')
class PlaceList(Resource):

    @api.expect(place_model, validate=True)
    def post(self):
        place_data = api.payload

        owner = facade.get_user(place_data['owner_id'])
        if not owner:
            return {'error': 'Owner not found'}, 400

        if 'amenities' in place_data:
            for amenity_id in place_data['amenities']:
                if not facade.get_amenity(amenity_id):
                    return {'error': f'Amenity {amenity_id} not found'}, 400

        new_place = facade.create_place(place_data)

        return {
            'id': new_place.id,
            'title': new_place.title,
            'description': new_place.description,
            'price': new_place.price,
            'latitude': new_place.latitude,
            'longitude': new_place.longitude,
            'owner_id': new_place.owner_id,
            'amenities': new_place.amenities
        }, 201


    def get(self):
        places = facade.get_all_places()
        return [{
            'id': p.id,
            'title': p.title,
            'latitude': p.latitude,
            'longitude': p.longitude
        } for p in places], 200


@api.route('/<string:place_id>')
class PlaceResource(Resource):

    def get(self, place_id):
        place = facade.get_place(place_id)
        if not place:
            return {'error': 'Place not found'}, 404

        owner = facade.get_user(place.owner_id)
        if not owner:
            return {'error': 'Owner not found'}, 400

        amenities = []
        for amenity_id in place.amenities:
            amenity = facade.get_amenity(amenity_id)
            if amenity:
                amenities.append({
                    'id': amenity.id,
                    'name': amenity.name
                })

        return {
            'id': place.id,
            'title': place.title,
            'description': place.description,
            'price': place.price,
            'latitude': place.latitude,
            'longitude': place.longitude,
            'owner': {
                'id': owner.id,
                'first_name': owner.first_name,
                'last_name': owner.last_name,
                'email': owner.email
            },
            'amenities': amenities
        }, 200


    @api.expect(place_model, validate=True)
    def put(self, place_id):
        place_data = api.payload

        if 'owner_id' in place_data:
            if not facade.get_user(place_data['owner_id']):
                return {'error': 'Owner not found'}, 400

        if 'amenities' in place_data:
            for amenity_id in place_data['amenities']:
                if not facade.get_amenity(amenity_id):
                    return {'error': f'Amenity {amenity_id} not found'}, 400

        updated_place = facade.update_place(place_id, place_data)
        if not updated_place:
            return {'error': 'Place not found'}, 404

        return {
            'id': updated_place.id,
            'title': updated_place.title,
            'description': updated_place.description,
            'price': updated_place.price,
            'latitude': updated_place.latitude,
            'longitude': updated_place.longitude,
            'owner_id': updated_place.owner_id,
            'amenities': updated_place.amenities
        }, 200

