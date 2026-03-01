"""Module for user endpoint"""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from model.review import Review

from services.Database.database import get_session
from services.DataManipulation.crud import Crud
from services.DataManipulation.datamanager import DataManager


users_bp = Blueprint('users', __name__)


@users_bp.get('/')
def get_users():
    raw_data = Crud.get('User')
    data_dict = dict()
    for data in raw_data:
        rd_data = DataManager.custom_encoder(data)
        for key, value in rd_data.items():
            value.pop('role')
            value.pop('password')
        data_dict.update(rd_data)
    if not data_dict:
        return jsonify({'message': 'No users found'}), 200
    return jsonify(data_dict), 200


@users_bp.get('/<user_id>')
def get_user_by_id(user_id):
    raw_data = Crud.get('User', user_id)
    if raw_data is None:
        return jsonify({'error': 'User not found'}), 404
    rd_data = DataManager.custom_encoder(raw_data)
    for key, value in rd_data.items():
        value.pop('role')
        value.pop('password')
    data_dict = dict()
    data_dict.update(rd_data)
    return jsonify(data_dict), 200


@users_bp.put('/<user_id>')
@jwt_required()
def update_user(user_id):
    datatoupdate = request.get_json()
    if not datatoupdate:
        return jsonify({'error': 'No data'}), 400
    data = Crud.get('User', user_id)
    if data is None:
        return jsonify({'error': 'User not found'}), 404
    fields_to_update = ['email', 'password', 'first_name', 'last_name']
    for field in fields_to_update:
        if datatoupdate.get(field):
            try:
                status = Crud.update('User', user_id, field, datatoupdate[field])
                if status == 404:
                    return jsonify({'error': 'User not found'}), 404
            except Exception as e:
                return jsonify({'error': str(e)}), 400
    return jsonify({'message': 'User updated'}), 201


@users_bp.delete('/<user_id>')
@jwt_required()
def delete_user(user_id):
    if not user_id:
        return jsonify({'error': 'Missing data'}), 400
    status = Crud.delete('User', user_id)
    if status == 404:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'message': 'User deleted'}), 204


@users_bp.get('/<user_id>/reviews')
def get_reviews(user_id):
    if not user_id:
        return jsonify({'error': 'Missing data'}), 400
    session = get_session()
    try:
        reviews = session.query(Review).filter(Review.user == user_id).all()
        data_dict = dict()
        for data in reviews:
            rd_data = DataManager.custom_encoder(data)
            data_dict.update(rd_data)
        if not data_dict:
            return jsonify({'message': 'No users found'}), 404
        return jsonify(data_dict), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 200
    finally:
        session.close()
