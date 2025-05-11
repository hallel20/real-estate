from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Property, Favorite
from werkzeug.security import generate_password_hash
from datetime import datetime

users_bp = Blueprint('users', __name__)

def user_to_profile_dict(user):
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'phone_number': user.phone_number,
        'created_at': user.created_at.isoformat(),
        'updated_at': user.updated_at.isoformat(),
        'role': user.role,
    }

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return jsonify(user_to_profile_dict(user)), 200

@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    # Validate input if needed; here we assume basic update
    updatable_fields = ['first_name', 'last_name', 'phone_number', 'email', 'username', 'password']

    for field in updatable_fields:
        if field in data:
            if field == 'password':
                user.password = generate_password_hash(data[field])
            else:
                setattr(user, field, data[field])

    user.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify(user_to_profile_dict(user)), 200


@users_bp.route('/favorites/<int:property_id>', methods=['POST'])
@jwt_required()
def add_favorite(property_id):
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    property_obj = Property.query.get_or_404(property_id)

    # Check if already favorite
    existing = Favorite.query.filter_by(user_id=user_id, property_id=property_id).first()
    if existing:
        return jsonify({"message": "Property already in favorites"}), 200

    fav = Favorite(user_id=user_id, property_id=property_id)
    db.session.add(fav)
    db.session.commit()
    return jsonify({"message": "Property added to favorites"}), 201

@users_bp.route('/favorites/<int:property_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite(property_id):
    user_id = get_jwt_identity()
    fav = Favorite.query.filter_by(user_id=user_id, property_id=property_id).first()
    if not fav:
        return jsonify({"error": "Favorite not found"}), 404
    db.session.delete(fav)
    db.session.commit()
    return jsonify({"message": "Property removed from favorites"}), 200

@users_bp.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()
    favorites = Favorite.query.filter_by(user_id=user_id).all()

    properties = [property_to_dict(fav.property) for fav in favorites]

    return jsonify(properties), 200


# Helper to convert Property object to dict, matching properties route's structure:
def property_to_dict(property_obj):
    return {
        'id': property_obj.id,
        'user_id': property_obj.user_id,
        'title': property_obj.title,
        'description': property_obj.description,
        'location': property_obj.location,
        'price': property_obj.price,
        'property_type': property_obj.property_type,
        'status': property_obj.status,
        'bedrooms': property_obj.bedrooms,
        'bathrooms': property_obj.bathrooms,
        'area': property_obj.area,
        'created_at': property_obj.created_at.isoformat(),
        'updated_at': property_obj.updated_at.isoformat(),
        'images': [img.url for img in property_obj.images],
    }
