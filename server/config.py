import os
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.environ.get('JWT_SECRET')
if JWT_SECRET is None:
    raise ValueError("JWT_SECRET environment variable not set")
DATABASE_URL = os.environ.get('DATABASE_URL')
if DATABASE_URL is None:
    raise ValueError("DATABASE_URL environment variable not set")

CLOUDINARY_API_KEY = os.environ.get('CLOUDINARY_API_KEY')
if CLOUDINARY_API_KEY is None:
    raise ValueError("CLOUDINARY_API_KEY environment variable not set")
CLOUDINARY_API_SECRET = os.environ.get('CLOUDINARY_API_SECRET')
if CLOUDINARY_API_SECRET is None:
    raise ValueError("CLOUDINARY_API_SECRET environment variable not set")
CLOUDINARY_CLOUD_NAME = os.environ.get('CLOUDINARY_CLOUD_NAME')
if CLOUDINARY_CLOUD_NAME is None:
    raise ValueError("CLOUDINARY_CLOUD_NAME environment variable not set")

# Mail Configuration - ensure these are in your .env file
MAIL_SERVER_ENV = os.environ.get('MAIL_SERVER')
MAIL_PORT_ENV = os.environ.get('MAIL_PORT', '587') # Default to 587 if not set
MAIL_USERNAME_ENV = os.environ.get('MAIL_USERNAME')
MAIL_PASSWORD_ENV = os.environ.get('MAIL_PASSWORD')
MAIL_USE_TLS_ENV = os.environ.get('MAIL_USE_TLS', 'True') # Default to True if not set
MAIL_USE_SSL_ENV = os.environ.get('MAIL_USE_SSL', 'False') # Default to False if not set
MAIL_DEFAULT_SENDER_ENV = os.environ.get('MAIL_DEFAULT_SENDER')

FRONTEND_URL_ENV = os.environ.get('FRONTEND_URL', 'http://localhost:3310') # Default frontend URL

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', DATABASE_URL)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', JWT_SECRET)
    DEBUG = os.getenv('DEBUG', 'False').lower() in ('true', '1', 't')
    MAIL_DEBUG = os.getenv('MAIL_DEBUG', 'False').lower() in ('true', '1', 't')

    # Flask-JWT-Extended cookie settings
    JWT_TOKEN_LOCATION = ['cookies']
    JWT_COOKIE_CSRF_PROTECT = False

    JWT_ACCESS_COOKIE_PATH = '/'  # Ensures it's accessible across your site
    # JWT_COOKIE_HTTPONLY = True # Default and recommended for access/refresh tokens
                                 # CSRF cookies are non-HttpOnly by default.
                                 # Set to False only if you explicitly need JS to read access/refresh tokens,
                                 # understanding the security risks.
    JWT_COOKIE_SAMESITE = "None"  # Allows cookies to be sent in cross-site contexts
    # JWT_COOKIE_SECURE should be True in production when SameSite="None"
    # For local HTTP development, it needs to be False for cookies to be set.
    JWT_COOKIE_SECURE = True

    # Flask-Mail configuration
    MAIL_SERVER = MAIL_SERVER_ENV
    MAIL_PORT = int(MAIL_PORT_ENV) # Ensure port is an integer
    MAIL_USERNAME = MAIL_USERNAME_ENV
    MAIL_PASSWORD = MAIL_PASSWORD_ENV
    MAIL_USE_TLS = MAIL_USE_TLS_ENV.lower() in ('true', '1', 't')
    MAIL_USE_SSL = MAIL_USE_SSL_ENV.lower() in ('true', '1', 't')
    MAIL_DEFAULT_SENDER = MAIL_DEFAULT_SENDER_ENV if MAIL_DEFAULT_SENDER_ENV else MAIL_USERNAME_ENV # Often defaults to username

    FRONTEND_URL = FRONTEND_URL_ENV

    CLOUDINARY_API_KEY = CLOUDINARY_API_KEY
    CLOUDINARY_API_SECRET = CLOUDINARY_API_SECRET
    CLOUDINARY_CLOUD_NAME = CLOUDINARY_CLOUD_NAME
