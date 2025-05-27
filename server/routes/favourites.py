from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Favorite

favourites_bp = Blueprint('favourites', __name__)

@favourites_bp.route('', methods=['GET'])
@jwt_required()
def get_favourites():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    favourites = Favorite.query.filter_by(user_id=user_id).all()
    data = [favourite.serialize() for favourite in favourites]
    return jsonify(data)


@favourites_bp.route('', methods=['POST'])
@jwt_required()
def add_favourite():
    data = request.get_json()
    property_id = data.get('property_id')
    user_id = get_jwt_identity()

    if not property_id:
        return jsonify({'error': 'Property ID is required'}), 400
    if not User.query.get(user_id):
        return jsonify({'error': 'Unauthorized'}), 401
    if Favorite.query.filter_by(user_id=user_id, property_id=property_id).first():
        return jsonify({'error': 'Property already in favourites'}), 400
    favourite = Favorite(user_id=user_id, property_id=property_id)
    db.session.add(favourite)
    db.session.commit()
    return jsonify(favourite.serialize()), 201


@favourites_bp.route('/<int:property_id>', methods=['DELETE'])
@jwt_required()
def remove_favourite(property_id):
    user_id = get_jwt_identity()
    favourite = Favorite.query.filter_by(property_id=property_id, user_id=user_id).first()
    
    if not favourite:
        return jsonify({'error': 'Favorite not found'}), 404
    
    db.session.delete(favourite)
    db.session.commit()
    return jsonify({'message': 'Favorite removed successfully'}), 200


@favourites_bp.route('/<int:property_id>', methods=['GET'])
@jwt_required()
def get_favourite(property_id):
    user_id = get_jwt_identity()
    favourite = Favorite.query.filter_by(id=property_id, user_id=user_id).first()
    
    if not favourite:
        return jsonify({'error': 'Favorite not found'}), 404
    
    return jsonify(favourite.serialize()), 200