from flask_restx import Namespace, Resource, fields
from app.services import facade

api = Namespace('places', description='Place operations')


place_model = api.model('Place', {
    'title': fields.String(required=True, description='Title of the place'),
    'description': fields.String(description='Description of the place'),
    'price': fields.Float(required=True, description='Price per night'),
    'latitude': fields.Float(required=True, description='Latitude of the place'),
    'longitude': fields.Float(required=True, description='Longitude of the place'),
    'owner_id': fields.String(required=True, description='ID of the owner'),
    'amenities': fields.List(fields.String, description="List of amenity IDs")
})

@api.route('/')
class PlaceList(Resource):
    @api.expect(place_model)
    def post(self):
        """Create a new place"""
        place_data = api.payload
        try:
            new_place = facade.create_place(place_data)
            if not new_place:
                return {"error": "Failed to create place"}, 400
            return {
                "id": new_place.id,
                "title": new_place.title,
                "message": "Place created successfully"
            }, 201
        except ValueError as e:
            return {"error": str(e)}, 400

    def get(self):
        """List all places"""
        places = facade.get_all_places()
        return [{
            "id": p.id,
            "title": p.title,
            "price": p.price,
            "latitude": p.latitude,
            "longitude": p.longitude,
            "owner": {
                "id": p.owner.id,
                "first_name": p.owner.first_name,
                "last_name": p.owner.last_name
            }
        } for p in places], 200
@api.route('/<place_id>')
class PlaceResource(Resource):
    def get(self, place_id):
        """Get place details by ID"""
        place = facade.get_place(place_id)
        if not place:
            return {"error": "Place not found"}, 404

        return {
            "id": place.id,
            "title": place.title,
            "description": place.description,
            "price": place.price,
            "latitude": place.latitude,
            "longitude": place.longitude,
            "owner": {
                "id": place.owner.id,
                "first_name": place.owner.first_name,
                "last_name": place.owner.last_name,
                "email": place.owner.email
            },
            "amenities": [
                {"id": am.id, "name": am.name} for am in place.amenities
            ]
        }, 200

    @api.expect(place_model)
    def put(self, place_id):
        """Update a place's information"""
        place_data = api.payload
        try:
            updated_place = facade.update_place(place_id, place_data)
            return {
                "id": updated_place.id,
                "message": "Place updated successfully"
            }, 200
        except ValueError as e:
            return {"error": str(e)}, 400

@api.route('/<place_id>/reviews')
class PlaceReviewList(Resource):
    @api.doc('get_place_reviews')
    def get(self, place_id):
        """Get all reviews for a specific place"""
        reviews = facade.get_reviews_by_place(place_id)
        if not reviews:
            return [], 200
        return [review.to_dict() for review in reviews], 200
