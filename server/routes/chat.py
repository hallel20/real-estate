from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_
from models import db, Chat, Message, User
from datetime import datetime, timezone

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('', methods=['GET'])
@jwt_required()
def get_chats():
    """
    Get all chats for the current user.
    A user is involved in a chat if they are the sender or receiver.
    """
    current_user_id = get_jwt_identity()
    
    # Ensure the user exists
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    chats = Chat.query.filter(
        or_(Chat.sender_id == current_user_id, Chat.reciever_id == current_user_id)
    ).order_by(Chat.updated_at.desc()).all()

    return jsonify([chat.serialize() for chat in chats]), 200

@chat_bp.route('/<int:chat_id>/messages', methods=['GET'])
@jwt_required()
def get_messages(chat_id):
    """
    Retrieve all messages for a given chat.
    Ensures the user is authorized to access the chat.
    Ensures the current user is part of the chat.
    """
    current_user_id = get_jwt_identity()
    
    chat = Chat.query.get(chat_id)
    if not chat:
        return jsonify({"error": "Chat not found"}), 404

    if chat.sender_id != current_user_id and chat.reciever_id != current_user_id:
        return jsonify({"error": "Unauthorized to view this chat"}), 403

    messages = Message.query.filter_by(chat_id=chat_id).order_by(Message.created_at.asc()).all()
    return jsonify([message.serialize() for message in messages]), 200

@chat_bp.route('/<int:chat_id>/messages', methods=['POST'])
@jwt_required()
def send_message(chat_id):
    """
    Send a new message in a specific chat.
    Ensures the current user is part of the chat.
    """
    current_user_id = get_jwt_identity()
    data = request.get_json()
    message_content = data.get('message')

    if not message_content:
        return jsonify({"error": "Message content is required"}), 400

    chat = Chat.query.get(chat_id)
    if not chat:
        return jsonify({"error": "Chat not found"}), 404

    if chat.sender_id != current_user_id and chat.reciever_id != current_user_id:
        return jsonify({"error": "Unauthorized to send message in this chat"}), 403
    
    # Determine the actual sender and receiver for this message context
    # The sender for the message is the current_user_id.
    # The receiver for the chat context is the other party.
    if chat.sender_id == current_user_id:
        # current user was the original sender of the chat (likely inquirer)
        # no change needed for chat.sender_id and chat.reciever_id
        pass
    elif chat.reciever_id == current_user_id:
        # current user was the original receiver of the chat (likely property owner)
        # no change needed for chat.sender_id and chat.reciever_id
        pass
    else:
        # This case should ideally not be hit due to the check above,
        # but as a safeguard:
        return jsonify({"error": "User is not a participant in this chat"}), 403


    new_message = Message(
        message=message_content,
        chat_id=chat_id,
        # created_at and updated_at are handled by model defaults
    )
    
    # Update chat's updated_at timestamp
    chat.updated_at = datetime.now(timezone.utc)

    db.session.add(new_message)
    db.session.add(chat) # to save updated_at
    db.session.commit()

    return jsonify(new_message.serialize()), 201
