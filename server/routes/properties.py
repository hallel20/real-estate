from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Property, Image, Inquiry
from sqlalchemy import or_, and_
from services.role_required import role_required

properties_bp = Blueprint('properties', __name__)

@properties_bp.route('', methods=['GET'])
def get_properties():
    query = Property.query

    location = request.args.get('location')
    price_min = request.args.get('price_min', type=float)
    price_max = request.args.get('price_max', type=float)
    property_type = request.args.get('property_type')
    status = request.args.get('status')

    page = request.args.get('page', default=1, type=int)
    page_size = request.args.get('page_size', default=10, type=int)
    sort = request.args.get('sort', default='created_at')

    if location:
        # simple case-insensitive containment search
        query = query.filter(Property.location.ilike(f"%{location}%"))
    if price_min is not None:
        query = query.filter(Property.price >= price_min)
    if price_max is not None:
        query = query.filter(Property.price <= price_max)
    if property_type:
        query = query.filter(Property.property_type == property_type)
    if status:
        query = query.filter(Property.status == status)

    # Sorting
    if sort.startswith('-'):
        sort_field = sort[1:]
        order = getattr(Property, sort_field).desc()
    else:
        sort_field = sort
        order = getattr(Property, sort_field).asc()
    query = query.order_by(order)

    pagination = query.paginate(page=page, per_page=page_size, error_out=False)
    properties = [p.serialize() for p in pagination.items]

    return jsonify({
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': pagination.page,
        'page_size': pagination.per_page,
        'properties': properties
    })


@properties_bp.route('/<int:property_id>', methods=['GET'])
def get_property(property_id):
    property_obj = Property.query.get_or_404(property_id)
    data = property_obj.serialize()
    return jsonify(data)


@properties_bp.route('', methods=['POST'])
@jwt_required()
@role_required('admin')
def create_property():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    location = data.get('location')
    price = data.get('price')
    property_type = data.get('property_type')
    status = data.get('status')
    bedrooms = data.get('bedrooms')
    bathrooms = data.get('bathrooms')
    area = data.get('area')
    year_built = data.get('year_built')
    amenities = data.get('amenities')
    images = data.get('images', [])  # list of image URLs

    if not all([title, description, location, price]):
        return jsonify({'error': 'Missing required property fields'}), 400

    prop = Property(
        user_id=user_id,
        title=title,
        description=description,
        location=location,
        price=price,
        property_type=property_type,
        status=status,
        bedrooms=bedrooms,
        bathrooms=bathrooms,
        area=area,
        year_built=year_built,
        amenities=amenities
    )
    db.session.add(prop)
    db.session.commit()

    # Add images
    for url in images:
        img = Image(property_id=prop.id, url=url)
        db.session.add(img)
    db.session.commit()

    return jsonify(prop.serialize()), 201


@properties_bp.route('/<int:property_id>', methods=['PUT'])
@jwt_required()
def update_property(property_id):
    user_id = get_jwt_identity()
    prop = Property.query.get_or_404(property_id)
    user = User.query.get(user_id)

    # Check ownership or admin
    if prop.user_id != user_id and user.role != 'admin':
        return jsonify({'error': 'Unauthorized - not owner or admin'}), 403

    data = request.get_json()

    updatable_fields = ['title', 'description', 'location', 'price', 'property_type', 'status', 
                        'bedrooms', 'bathrooms', 'area', 'year_built', 'amenities']
    for key in updatable_fields:
        if key in data:
            setattr(prop, key, data[key])

    # Handle images update: list new, delete existing by URL
    images = data.get('images')
    if images is not None:
        # Delete current images
        Image.query.filter_by(property_id=prop.id).delete()
        # Add new images
        for url in images:
            img = Image(property_id=prop.id, url=url)
            db.session.add(img)

    db.session.commit()
    return jsonify(prop.serialize())


@properties_bp.route('/<int:property_id>', methods=['DELETE'])
@jwt_required()
def delete_property(property_id):
    user_id = get_jwt_identity()
    prop = Property.query.get_or_404(property_id)
    user = User.query.get(user_id)

    # Check ownership or admin
    if prop.user_id != user_id and user.role != 'admin':
        return jsonify({'error': 'Unauthorized - not owner or admin'}), 403

    # Images will be deleted automatically due to cascade="all, delete-orphan" 
    # in the Property.images relationship if you added that to models.py.
    # Delete property
    db.session.delete(prop)
    db.session.commit()
    return jsonify({'message': 'Property deleted successfully'})
