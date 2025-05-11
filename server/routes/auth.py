from flask import Blueprint, request, jsonify
from models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token, jwt_required,
    get_jwt_identity, unset_jwt_cookies,
    set_access_cookies, JWTManager
)
from services.email_service import send_welcome_email, send_password_reset_email  # Import email functions
from datetime import datetime, timedelta
import uuid

auth_bp = Blueprint('auth', __name__)
jwt = JWTManager()


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    # Validate required fields
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    phone_number = data.get('phone_number')

    if not all([username, email, password]):
        return jsonify({"error": "Username, email, and password are required"}), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"error": "Username or email already exists"}), 400

    hashed_password = generate_password_hash(password)

    user = User(
        username=username,
        email=email,
        password=hashed_password,
        first_name=first_name,
        last_name=last_name,
        phone_number=phone_number,
        role='user'
    )
    db.session.add(user)
    db.session.commit()

    # Send welcome email directly
    try:
        send_welcome_email(email=user.email, username=user.username)
    except Exception as e:
        print(f"Error sending welcome email: {e}")
        # Handle the error appropriately, e.g., log it, show a user-friendly message, or retry.
        return jsonify({"message": "User registered successfully, but there was an error sending the welcome email."}), 201  # Still return 201


    return jsonify({"message": "User registered successfully", "user_id": user.id}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username_or_email = data.get('username') or data.get('email')
    password = data.get('password')

    if not username_or_email or not password:
        return jsonify({"error": "Username/email and password are required"}), 400

    user = User.query.filter(
        (User.username == username_or_email) | (User.email == username_or_email)
    ).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)
    response = jsonify({"message": "Login successful"})

    # Set JWT access token in HttpOnly secure cookie
    set_access_cookies(response, access_token, max_age=3600, secure=True, samesite='Strict')

    return response, 200


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    response = jsonify({"message": "Logout successful"})
    unset_jwt_cookies(response)
    return response



@auth_bp.route('/reset-password-request', methods=['POST'])
def reset_password_request():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "If email exists in system, password reset email has been sent."}), 200

    # Generate a unique token and expiration
    reset_token = str(uuid.uuid4())
    expire_at = datetime.utcnow() + timedelta(hours=1)

    # Store token and expiry in user model or a separate table
    # For clarity, adding reset_token and reset_token_expire fields to User model is needed.
    setattr(user, 'reset_token', reset_token)
    setattr(user, 'reset_token_expire', expire_at)
    db.session.commit()

    # Send password reset email directly
    try:
        send_password_reset_email(email=user.email, token=reset_token)
    except Exception as e:
        print(f"Error sending password reset email: {e}")
        return jsonify({"message": "If email exists in system, password reset email has been sent."}), 200 #still return 200

    return jsonify({"message": "If email exists in system, password reset email has been sent."}), 200


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('new_password')

    if not token or not new_password:
        return jsonify({"error": "Token and new password are required"}), 400

    user = User.query.filter_by(reset_token=token).first()
    if not user:
        return jsonify({"error": "Invalid token"}), 400

    if datetime.utcnow() > getattr(user, 'reset_token_expire', datetime.utcnow()):
        return jsonify({"error": "Token expired"}), 400

    user.password = generate_password_hash(new_password)
    user.reset_token = None
    user.reset_token_expire = None
    db.session.commit()

    return jsonify({"message": "Password has been reset successfully"}), 200