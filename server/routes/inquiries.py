from flask import Blueprint, request, jsonify
from models import db, Inquiry, Property, User
from services.email_service import send_inquiry_notification_email  # Celery task stub
from datetime import datetime

inquiries_bp = Blueprint('inquiries', __name__)

@inquiries_bp.route('', methods=['POST'])
def submit_inquiry():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')
    property_id = data.get('property_id')

    if not all([name, email, message, property_id]):
        return jsonify({"error": "Name, email, message and property_id are required"}), 400

    property_obj = Property.query.get(property_id)
    if not property_obj:
        return jsonify({"error": "Property does not exist"}), 404

    inquiry = Inquiry(
        name=name,
        email=email,
        message=message,
        property_id=property_id,
        created_at=datetime.utcnow()
    )
    db.session.add(inquiry)
    db.session.commit()

    # Notify the listing agent asynchronously via email (Celery task)
    # Assuming property_obj.user is the listing agent
    agent = User.query.get(property_obj.user_id)
    if agent:
        # send_inquiry_notification_email.delay(agent.email, inquiry.id)
        pass

    return jsonify({"message": "Inquiry submitted successfully"}), 201
