from flask import request
from flask_restx import Namespace, Resource, fields, abort
from app.services import facade
import re

api = Namespace('users', description='User operations')

user_model = api.model('User', {
    'id': fields.String(readOnly=True, description='The user unique identifier'),
    'first_name': fields.String(required=True, description='First name', min_length=1, max_length=50),
    'last_name': fields.String(required=True, description='Last name', min_length=1, max_length=50),
    'email': fields.String(required=True, description='User email address')
})

def is_valid_email(email):
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(email_regex, email) is not None

@api.route('/')
class UserList(Resource):
    @api.marshal_list_with(user_model)
    @api.response(200, 'List of users retrieved successfully')
    def get(self):
        """List all users"""
        return facade.get_all_users(), 200

    @api.expect(user_model, validate=True)
    @api.response(201, 'User successfully created')
    @api.response(400, 'Invalid input or Email already exists')
    def post(self):
        """Create a new user"""
        user_data = api.payload

        if not is_valid_email(user_data['email']):
            return {'error': 'Invalid email format'}, 400

        try:
            new_user = facade.create_user(user_data)
            return {
                'id': new_user.id,
                'first_name': new_user.first_name,
                'last_name': new_user.last_name,
                'email': new_user.email
            }, 201
        except ValueError as e:
            return {'error': str(e)}, 400

@api.route('/<user_id>')
class UserResource(Resource):
    @api.marshal_with(user_model)
    @api.response(200, 'User details retrieved successfully')
    @api.response(404, 'User not found')
    def get(self, user_id):
        """Get user by ID"""
        user = facade.get_user(user_id)
        if not user:
            abort(404, "User not found")
        return user, 200

    @api.expect(user_model)
    @api.marshal_with(user_model)
    @api.response(200, 'User updated successfully')
    @api.response(400, 'Invalid input data')
    @api.response(404, 'User not found')
    def put(self, user_id):
        """Update user by ID"""
        user_data = api.payload
        try:
            updated_user = facade.update_user(user_id, user_data)
            if not updated_user:
                abort(404, "User not found")
            return updated_user, 201
        except ValueError as e:
            abort(400, str(e))
