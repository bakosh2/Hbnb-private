"""Module for amenities endpoint"""
from uuid import uuid4

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from model.amenity import Amenity

from services.DataManipulation.crud import Crud
from services.DataManipulation.datamanager import DataManager


amenities_bp = Blueprint('amenities', __name__)


@amenities_bp.get('/')
def get_amenities():
    raw_data = Crud.get('Amenity')
    data_dict = dict()
    for data in raw_data:
        data_dict.update(DataManager.custom_encoder(data))
    if not data_dict:
        return jsonify({'message': 'No amenities found'}), 200
    return jsonify(data_dict), 200


@amenities_bp.get('/<amenity_id>')
def get_amenity_by_id(amenity_id):
    raw_data = Crud.get('Amenity', amenity_id)
    if not raw_data:
        return jsonify({'error': 'Amenity not found'}), 404
    rd_data = DataManager.custom_encoder(raw_data)
    data_dict = dict()
    data_dict.update(rd_data)
    return jsonify(data_dict), 200


@amenities_bp.post('/')
@jwt_required()
def create_amenity():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data'}), 400
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Amenity name is required'}), 400
    try:
        new_amenity_id = str(uuid4())
        amenity = Amenity(id=new_amenity_id, name=name)
        DataManager.save_to_db(amenity)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    amenity = Crud.get('Amenity', new_amenity_id)
    return jsonify(DataManager.custom_encoder(amenity)), 201


@amenities_bp.put('/<amenity_id>')
@jwt_required()
def update_amenity(amenity_id):
    datatoupdate = request.get_json()
    if not datatoupdate:
        return jsonify({'error': 'No data'}), 400
    data = Crud.get('Amenity', amenity_id)
    if data is None:
        return jsonify({'error': 'Amenity not found'}), 404
    name = datatoupdate.get('name')
    if not name:
        return jsonify({'error': 'Amenity name is required'}), 400
    try:
        Crud.update('Amenity', amenity_id, 'name', name)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    return jsonify({'message': 'Amenity updated'}), 201


@amenities_bp.delete('/<amenity_id>')
@jwt_required()
def delete_amenity(amenity_id):
    if not amenity_id:
        return jsonify({'error': 'Missing data'}), 400
    status = Crud.delete('Amenity', amenity_id)
    if status == 404:
        return jsonify({'error': 'Amenity not found'}), 404
    return jsonify({'message': 'Amenity deleted'}), 204
