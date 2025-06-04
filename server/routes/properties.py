from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from models import db, User, Property, Image, Inquiry
from sqlalchemy import or_, and_
from services.role_required import role_required

properties_bp = Blueprint('properties', __name__)

@properties_bp.route('', methods=['GET'])
def get_properties():
    query = Property.query

    location = request.args.get('location')
    # Renamed for clarity with frontend params
    min_price = request.args.get('minPrice', type=float)
    max_price = request.args.get('maxPrice', type=float)
    property_type = request.args.get('property_type')
    status = request.args.get('status')
    # New filters
    min_bedrooms = request.args.get('minBedrooms', type=int)
    min_bathrooms = request.args.get('minBathrooms', type=int) # Assuming float for bathrooms if half baths are possible
    min_area = request.args.get('minArea', type=float)
    keywords = request.args.get('keywords')

    page = request.args.get('page', default=1, type=int)
    page_size = request.args.get('page_size', default=10, type=int)
    sort = request.args.get('sort', default='created_at')

    variant = request.args.get('variant')

    if variant == 'mine':
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'Unauthorized'}), 401
        properties = Property.query.filter_by(user_id=user_id).all()
        data = [p.serialize() for p in properties]
        return jsonify(data)
    elif variant == 'featured':
        query = query.filter(Property.is_featured == True)
    
    if location:
        location_term = f"%{location.lower()}%"
        query = query.filter(
            or_(
                Property.address.ilike(location_term),
                Property.city.ilike(location_term),
                Property.state.ilike(location_term),
                Property.zip_code.ilike(location_term) # if zip code search is desired
            )
        )
    if min_price is not None:
        query = query.filter(Property.price >= min_price)
    if max_price is not None:
        query = query.filter(Property.price <= max_price)
    if property_type:
        query = query.filter(Property.property_type == property_type)
    if status:
        query = query.filter(Property.status == status)
    if min_bedrooms is not None:
        query = query.filter(Property.bedrooms >= min_bedrooms)
    if min_bathrooms is not None:
        query = query.filter(Property.bathrooms >= min_bathrooms)
    if min_area is not None:
        query = query.filter(Property.area >= min_area)
    if keywords:
        keyword_term = f"%{keywords.lower()}%"
        query = query.filter(
            or_(
                Property.title.ilike(keyword_term),
                Property.description.ilike(keyword_term),
                Property.amenities.ilike(keyword_term) # Assumes amenities is a string field
            )
        )

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
# @role_required('admin')
def create_property():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    
    title = data.get('title')
    description = data.get('description')
    price = data.get('price')
    property_type = data.get('property_type')
    status = data.get('status')
    amenities = data.get('amenities')
    images = data.get('images', [])  # list of image URLs

    # Extract nested location data
    location_data = data.get('location', {})
    address = location_data.get('address')
    city = location_data.get('city')
    state = location_data.get('state')
    zip_code_val = location_data.get('zipCode') # Frontend sends 'zipCode'
    latitude = location_data.get('latitude')

    # Extract nested features data
    features_data = data.get('features', {})
    bedrooms = features_data.get('bedrooms')
    bathrooms = features_data.get('bathrooms')
    area = features_data.get('area')
    year_built_val = features_data.get('year_built') # Frontend sends 'year_built'

    # Validate required fields
    if not all([title, description, address, city, state, zip_code_val, price]):
        return jsonify({'error': 'Missing required property fields'}), 400

    prop = Property(
        user_id=user_id,
        title=title,
        description=description,
        address=address,
        city=city,
        state=state,
        zip_code=zip_code_val, # Assign to model's 'zip_code'
        latitude=latitude,
        price=price,
        property_type=property_type,
        status=status,
        bedrooms=bedrooms,
        bathrooms=bathrooms,
        area=area,
        year_built=year_built_val, # Assign to model's 'year_built'
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

@properties_bp.route('/<int:property_id>/feature', methods=['PATCH'])
@jwt_required()
@role_required('admin')
def feature_property(property_id):
    property_obj = Property.query.get_or_404(property_id)
    property_obj.is_featured = not property_obj.is_featured
    db.session.commit()
    return jsonify(property_obj.serialize())


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

    # Handle top-level simple fields
    simple_update_fields = ['title', 'description', 'price', 'property_type', 'status', 'amenities']
    for key in simple_update_fields:
        if key in data:
            setattr(prop, key, data[key])

    # Handle nested location fields
    if 'location' in data and isinstance(data['location'], dict):
        location_data = data['location']
        location_update_map = {
            'address': 'address',
            'city': 'city',
            'state': 'state',
            'zipCode': 'zip_code',  # Frontend 'zipCode' to model 'zip_code'
            'latitude': 'latitude'
        }
        for frontend_key, model_key in location_update_map.items():
            if frontend_key in location_data:
                setattr(prop, model_key, location_data[frontend_key])
    
    # Handle nested features fields
    if 'features' in data and isinstance(data['features'], dict):
        features_data = data['features']
        features_update_map = {
            'bedrooms': 'bedrooms',
            'bathrooms': 'bathrooms',
            'area': 'area',
            'year_built': 'year_built' # Frontend 'year_built' to model 'year_built'
        }
        for frontend_key, model_key in features_update_map.items():
            if frontend_key in features_data:
                setattr(prop, model_key, features_data[frontend_key])

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
