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

    chats_query = Chat.query.filter(
        or_(Chat.sender_id == current_user_id, Chat.receiver_id == current_user_id)
    ).order_by(Chat.updated_at.desc()).all()

    # The is_read status will now be handled by a dedicated endpoint when a chat is opened.
    return jsonify([chat.serialize(include_property=True) for chat in chats_query]), 200

@chat_bp.route('/<int:chat_id>/messages', methods=['GET'])
@jwt_required()
def get_messages(chat_id):
    """
    Retrieve all messages for a given chat.
    Ensures the user is authorized to access the chat.
    Ensures the current user is part of the chat.
    """
    current_user_id = int(get_jwt_identity())
    
    chat = Chat.query.get(chat_id)
    if not chat:
        return jsonify({"error": "Chat not found"}), 404

    print(chat.sender_id, chat.receiver_id, current_user_id)

    if chat.sender_id != current_user_id and chat.receiver_id != current_user_id:
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
    current_user_id = int(get_jwt_identity())
    data = request.get_json()
    message_content = data.get('message')

    if not message_content:
        return jsonify({"error": "Message content is required"}), 400

    chat = Chat.query.get(chat_id)
    if not chat:
        return jsonify({"error": "Chat not found"}), 404

    # Ensure the current user is a participant in the chat
    if chat.sender_id != current_user_id and chat.receiver_id != current_user_id:
        return jsonify({"error": "Unauthorized to send message in this chat"}), 403
    
    new_message = Message(
        message=message_content,
        chat_id=chat_id,
        sender_id=current_user_id 
        # created_at and updated_at are handled by model defaults
    )
    
    # Update chat's updated_at timestamp
    chat.updated_at = datetime.now(timezone.utc)
    # Mark chat as unread since a new message is added
    chat.is_read = False
    # Set the sender of this last message
    chat.last_message_sender_id = current_user_id

    db.session.add(new_message)
    db.session.add(chat) # to save updated_at
    db.session.commit()

    return jsonify(new_message.serialize()), 201

@chat_bp.route('/<int:chat_id>/read', methods=['POST'])
@jwt_required()
def mark_chat_as_read(chat_id):
    """
    Mark a specific chat as read by the current user.
    """
    current_user_id = int(get_jwt_identity())
    chat = Chat.query.get(chat_id)

    if not chat:
        return jsonify({"error": "Chat not found"}), 404

    # Ensure the current user is a participant in the chat
    if chat.sender_id != current_user_id and chat.receiver_id != current_user_id:
        return jsonify({"error": "Unauthorized to mark this chat as read"}), 403

    # Only mark as read if the current user is not the sender of the last message
    # and the chat is currently unread.
    if not chat.is_read and chat.last_message_sender_id != current_user_id:
        chat.is_read = True
        chat.updated_at = datetime.now(timezone.utc) # Optionally update timestamp
        db.session.commit()
        return jsonify({"message": "Chat marked as read", "chat": chat.serialize(include_property=True)}), 200
    elif chat.is_read:
        return jsonify({"message": "Chat already marked as read", "chat": chat.serialize(include_property=True)}), 200
    else: # User is the last sender, no action needed from them to mark as read
        return jsonify({"message": "No action needed to mark chat as read by sender of last message", "chat": chat.serialize(include_property=True)}), 200
