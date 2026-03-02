from flask_restx import Namespace, Resource, fields
from app.services import facade

api = Namespace('reviews', description='Review operations')

# ---------- Models ----------
review_model = api.model('Review', {
    'text':     fields.String(required=True, description='Review text'),
    'rating':   fields.Integer(required=True, description='Rating (1-5)'),
    'user_id':  fields.String(required=True, description='Reviewer user ID'),
    'place_id': fields.String(required=True, description='Reviewed place ID'),
})

review_response = api.model('ReviewResponse', {
    'id':         fields.String(description='Review ID'),
    'text':       fields.String(description='Review text'),
    'rating':     fields.Integer(description='Rating'),
    'user_id':    fields.String(description='User ID'),
    'place_id':   fields.String(description='Place ID'),
    'created_at': fields.String(description='Creation timestamp'),
    'updated_at': fields.String(description='Update timestamp'),
})


# ---------- Endpoints ----------
@api.route('/')
class ReviewList(Resource):

    @api.response(200, 'List of reviews retrieved successfully')
    def get(self):
        """Retrieve all reviews."""
        return [r.to_dict() for r in facade.get_all_reviews()], 200

    @api.expect(review_model, validate=True)
    @api.response(201, 'Review created successfully')
    @api.response(400, 'Invalid input data')
    @api.response(404, 'User or Place not found')
    def post(self):
        """Create a new review."""
        data = api.payload
        try:
            review = facade.create_review(data)
            return review.to_dict(), 201
        except ValueError as e:
            return {'error': str(e)}, 400


@api.route('/<string:review_id>')
class ReviewResource(Resource):

    @api.response(200, 'Review details retrieved successfully')
    @api.response(404, 'Review not found')
    def get(self, review_id):
        """Get a review by ID."""
        review = facade.get_review(review_id)
        if not review:
            return {'error': 'Review not found'}, 404
        return review.to_dict(), 200

    @api.expect(review_model, validate=False)
    @api.response(200, 'Review updated successfully')
    @api.response(400, 'Invalid input data')
    @api.response(404, 'Review not found')
    def put(self, review_id):
        """Update a review."""
        data = api.payload
        if not data:
            return {'error': 'No data provided'}, 400
        try:
            review = facade.update_review(review_id, data)
            if not review:
                return {'error': 'Review not found'}, 404
            return review.to_dict(), 200
        except ValueError as e:
            return {'error': str(e)}, 400

    @api.response(200, 'Review deleted successfully')
    @api.response(404, 'Review not found')
    def delete(self, review_id):
        """Delete a review."""
        if not facade.delete_review(review_id):
            return {'error': 'Review not found'}, 404
        return {'message': 'Review deleted successfully'}, 200
