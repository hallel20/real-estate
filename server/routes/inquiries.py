from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from models import db, Inquiry, Property, User, Chat, Message # Added Chat and Message
from services.email_service import send_inquiry_notification_email  # Celery task stub
from services.role_required import role_required # For authorization
from datetime import datetime, timezone

inquiries_bp = Blueprint('inquiries', __name__)

@inquiries_bp.route('', methods=['POST'])
def submit_inquiry():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')
    property_id = data.get('property_id')
    
    user = User.query.filter_by(email=email).first()

    current_user_id = user.id if user else None

    if not all([name, email, message, property_id]):
        return jsonify({"error": "Name, email, message and property_id are required"}), 400

    property_obj = Property.query.get(property_id)
    if not property_obj:
        return jsonify({"error": "Property does not exist"}), 404

    inquiry_user_id = None
    if current_user_id:
        verify_jwt_in_request()
        user_making_inquiry = User.query.get(current_user_id)
        if user_making_inquiry:
            inquiry_user_id = user_making_inquiry.id
            # Optionally prefill name/email if not provided or override
            # name = name or user_making_inquiry.first_name
            # email = email or user_making_inquiry.email

    inquiry = Inquiry(
        name=name,
        email=email,
        message=message,
        property_id=property_id,
        user_id=inquiry_user_id,
        status='pending' # Default status
    )
    db.session.add(inquiry)
    db.session.commit()

    user = User.query.filter_by(email=email).first()
    if user:
        chat = Chat(
            sender_id=user.id, # The user who made the inquiry (can be different from property owner)
            reciever_id=property_obj.user_id,  # Assuming the property owner is the receiver
            property_id=property_id,
            inquiry_id=inquiry.id,  # Link the chat to the inquiry
        )
        db.session.add(chat)
        # Commit here to get chat.id if needed immediately, or commit once at the end
        db.session.commit()

        # Create the initial message in the chat
        initial_chat_message = Message(
            message=message, # Use the inquiry's message as the first chat message
            chat_id=chat.id,
            created_at=inquiry.created_at,  # Use the inquiry's created_at for consistency
        )
        db.session.add(initial_chat_message)
        db.session.commit()

    # Notify the listing agent asynchronously via email (Celery task)
    # Assuming property_obj.user is the listing agent
    agent = User.query.get(property_obj.user_id)
    if agent:
        # send_inquiry_notification_email.delay(agent.email, inquiry.id)
        pass

    return jsonify(inquiry.serialize()), 201

@inquiries_bp.route('', methods=['GET'])
@jwt_required()
@role_required('admin') # Only admins can fetch all inquiries
def get_all_inquiries():
    """
    Get all inquiries. (Admin only)
    """
    inquiries = Inquiry.query.order_by(Inquiry.created_at.desc()).all()
    return jsonify([inq.serialize() for inq in inquiries]), 200

@inquiries_bp.route('/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_inquiries(user_id):
    """
    Get all inquiries made by a specific user.
    User must be the one specified in user_id or an admin.
    """
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user:
        return jsonify({"error": "User not found"}), 404

    if current_user.id != user_id and current_user.role != 'admin':
        return jsonify({"error": "Unauthorized"}), 403

    inquiries = Inquiry.query.filter_by(user_id=user_id).order_by(Inquiry.created_at.desc()).all()
    return jsonify([inq.serialize() for inq in inquiries]), 200

@inquiries_bp.route('/property/<int:property_id>', methods=['GET'])
@jwt_required()
def get_property_inquiries(property_id):
    """
    Get all inquiries for a specific property.
    User must be the owner of the property or an admin.
    """
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    property_obj = Property.query.get(property_id)

    if not current_user:
        return jsonify({"error": "Current user not found"}), 404
    if not property_obj:
        return jsonify({"error": "Property not found"}), 404

    if property_obj.user_id != current_user_id and current_user.role != 'admin':
        return jsonify({"error": "Unauthorized to view inquiries for this property"}), 403

    inquiries = Inquiry.query.filter_by(property_id=property_id).order_by(Inquiry.created_at.desc()).all()
    return jsonify([inq.serialize() for inq in inquiries]), 200

@inquiries_bp.route('/<int:inquiry_id>/status', methods=['PUT']) # Changed route slightly for clarity
@jwt_required()
def update_inquiry_status(inquiry_id):
    """
    Update the status of an inquiry.
    User must be the owner of the property related to the inquiry or an admin.
    """
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    inquiry = Inquiry.query.get(inquiry_id)

    if not current_user:
        return jsonify({"error": "Current user not found"}), 404
    if not inquiry:
        return jsonify({"error": "Inquiry not found"}), 404

    property_obj = Property.query.get(inquiry.property_id)
    if not property_obj:
        return jsonify({"error": "Associated property not found"}), 404 # Should not happen if data is consistent

    if property_obj.user_id != current_user_id and current_user.role != 'admin':
        return jsonify({"error": "Unauthorized to update this inquiry"}), 403

    data = request.get_json()
    new_status = data.get('status')
    if not new_status:
        return jsonify({"error": "Status is required"}), 400

    inquiry.status = new_status
    inquiry.updated_at = datetime.now(timezone.utc)
    db.session.commit()
    return jsonify(inquiry.serialize()), 200
