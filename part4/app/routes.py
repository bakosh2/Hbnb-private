from flask import Blueprint, jsonify

main_bp = Blueprint('main', __name__)

@main_bp.route('/places', methods=['GET'])
def get_places():
    
    data = [
        {"id": 1, "name": "Cozy Apartment", "description": "A nice place in Paris"},
        {"id": 2, "name": "Beach House", "description": "Sunny house in Miami"}
    ]
    return jsonify(data)