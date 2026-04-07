from flask import request
from flask_restx import Namespace, Resource, fields, abort
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.services import facade
import re

api = Namespace('users', description='User operations')

user_model = api.model('User', {
    'id': fields.String(readOnly=True),
    'first_name': fields.String(required=True, min_length=1, max_length=50),
    'last_name': fields.String(required=True, min_length=1, max_length=50),
    'email': fields.String(required=True)
})

user_input_model = api.model('UserInput', {
    'first_name': fields.String(required=True, min_length=1, max_length=50),
    'last_name':  fields.String(required=True, min_length=1, max_length=50),
    'email':      fields.String(required=True),
    'password':   fields.String(required=True),
})


def is_valid_email(email):
    return re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$', email) is not None


@api.route('/')
class UserList(Resource):

    @jwt_required()
    @api.marshal_list_with(user_model)
    def get(self):
        """Retrieve all users (authenticated)"""
        return facade.get_all_users(), 200

    @api.expect(user_input_model, validate=True)
    @api.response(201, 'User successfully created')
    @api.response(400, 'Invalid input or Email already exists')
    def post(self):
        """Public registration endpoint"""
        user_data = api.payload

        if not is_valid_email(user_data['email']):
            abort(400, "Invalid email format")

        existing_user = facade.get_user_by_email(user_data['email'])
        if existing_user:
            abort(400, "Email already registered")

        try:
            new_user = facade.create_user(user_data)
            return new_user.to_dict(), 201
        except Exception as e:
            abort(400, str(e))


@api.route('/<user_id>')
@api.param('user_id', 'The user identifier')
@api.response(404, 'User not found')
class UserResource(Resource):

    @api.marshal_with(user_model)
    def get(self, user_id):
        """Get user by ID"""
        user = facade.get_user(user_id)
        if not user:
            abort(404, "User not found")
        return user, 200

    @jwt_required()
    @api.expect(user_model, validate=False)
    @api.response(200, 'User updated successfully')
    @api.response(400, 'Invalid data')
    @api.response(403, 'Unauthorized action')
    def put(self, user_id):
        """Update own user info (no email/password change)"""
        current_user = get_jwt_identity()
        claims = get_jwt()

        # Only the user themselves (not admin via this endpoint)
        if str(user_id) != str(current_user):
            abort(403, "Unauthorized action")

        user_data = api.payload or {}

        if 'email' in user_data or 'password' in user_data:
            abort(400, "You cannot modify email or password.")

        updated_user = facade.update_user(user_id, user_data)
        if not updated_user:
            abort(404, "User not found")

        return updated_user.to_dict(), 200
