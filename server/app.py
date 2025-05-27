import logging
from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from models import db
from services.email_service import mail # Import the mail instance
from routes.auth import auth_bp, jwt
from routes.properties import properties_bp
from routes.users import users_bp
from routes.inquiries import inquiries_bp
from routes.upload import upload_bp
from routes.favourites import favourites_bp
from routes.chat import chat_bp
from config import Config

migrate = Migrate()

def create_app(config_class=Config):
    """
    Creates and configures the Flask application.
    """
    
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Flask extensions here
    mail.init_app(app)  # Initialize Flask-Mail
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app) # Initialize JWTManager
    CORS(app, origins=['http://localhost:3310', 'https://realestate.cyberwizdev.com.ng'], supports_credentials=True)

    # Registering blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(properties_bp, url_prefix='/api/properties')
    app.register_blueprint(favourites_bp, url_prefix='/api/favourites')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(inquiries_bp, url_prefix='/api/inquiries')
    app.register_blueprint(upload_bp, url_prefix='/api/upload')
    app.register_blueprint(chat_bp, url_prefix='/api/chat')

    # Error handlers
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Bad Request', 'message': error.description}), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not Found', 'message': error.description}), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        app.logger.error('Server Error: %s', error)
        return jsonify({'error': 'Internal Server Error', 'message': 'An unexpected error occurred.'}), 500

    # Logging configuration
    logging.basicConfig(level=logging.INFO)
    app.logger.info("Application started")
    with app.app_context():
         db.create_all()

    return app

app = create_app()

if __name__ == '__main__':
    # This block is for development purposes only.
    # In production, use a WSGI server like Gunicorn:
    # gunicorn app:app
    app.run(debug=Config.DEBUG)