from flask_restx import Namespace, Resource, fields
from app.services import facade

api = Namespace('users', description='User operations')

# ---------- Models ----------
user_model = api.model('User', {
    'first_name': fields.String(required=True, description='First name'),
    'last_name':  fields.String(required=True, description='Last name'),
    'email':      fields.String(required=True, description='Email address'),
    'password':   fields.String(required=True, description='Password'),
})

user_response = api.model('UserResponse', {
    'id':         fields.String(description='User ID'),
    'first_name': fields.String(description='First name'),
    'last_name':  fields.String(description='Last name'),
    'email':      fields.String(description='Email address'),
    'created_at': fields.String(description='Creation timestamp'),
    'updated_at': fields.String(description='Update timestamp'),
})


# ---------- Endpoints ----------
@api.route('/')
class UserList(Resource):

    @api.response(200, 'List of users retrieved successfully')
    def get(self):
        """Retrieve all users."""
        users = facade.get_all_users()
        return [u.to_dict() for u in users], 200

    @api.expect(user_model, validate=True)
    @api.response(201, 'User created successfully')
    @api.response(400, 'Email already registered or invalid data')
    def post(self):
        """Register a new user."""
        data = api.payload

        for field in ('first_name', 'last_name', 'email', 'password'):
            if not data.get(field, '').strip():
                return {'error': f'{field} is required'}, 400

        try:
            user = facade.create_user(data)
            return user.to_dict(), 201
        except ValueError as e:
            return {'error': str(e)}, 400


@api.route('/<string:user_id>')
class UserResource(Resource):

    @api.response(200, 'User details retrieved successfully')
    @api.response(404, 'User not found')
    def get(self, user_id):
        """Get a user by ID."""
        user = facade.get_user(user_id)
        if not user:
            return {'error': 'User not found'}, 404
        return user.to_dict(), 200

    @api.expect(user_model, validate=False)
    @api.response(200, 'User updated successfully')
    @api.response(400, 'Invalid data')
    @api.response(404, 'User not found')
    def put(self, user_id):
        """Update a user."""
        data = api.payload
        if not data:
            return {'error': 'No data provided'}, 400
        try:
            user = facade.update_user(user_id, data)
            if not user:
                return {'error': 'User not found'}, 404
            return user.to_dict(), 200
        except ValueError as e:
            return {'error': str(e)}, 400
