from flask import Blueprint, request, jsonify
import cloudinary
import cloudinary.uploader
from config import Config
from services.role_required import role_required
from flask_jwt_extended import jwt_required


# Configuration
cloudinary.config(
    cloud_name=Config.CLOUDINARY_CLOUD_NAME,
    api_key=Config.CLOUDINARY_API_KEY,
    api_secret=Config.CLOUDINARY_API_SECRET,  # Click 'View API Keys' above to copy your API secret
    secure=True
)

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/', methods=['POST'])
@jwt_required()
@role_required('admin')
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['image']

    if image_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        upload_result = cloudinary.uploader.upload(image_file)
        return jsonify({'secure_url': upload_result['secure_url']}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
