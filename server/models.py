from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    phone_number = db.Column(db.String(15))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    role = db.Column(db.String(20), default='user')

    # Fields for password reset
    reset_token = db.Column(db.String(100), unique=True, nullable=True)
    reset_token_expire = db.Column(db.DateTime, nullable=True)

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone_number': self.phone_number,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Property(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(200), nullable=True)
    address = db.Column(db.String(200), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    zip_code = db.Column(db.String(20), nullable=False)
    latitude = db.Column(db.Float, nullable=True)
    price = db.Column(db.Float, nullable=False)
    property_type = db.Column(db.String(50))
    status = db.Column(db.String(50))
    bedrooms = db.Column(db.Integer)
    bathrooms = db.Column(db.Integer)
    area = db.Column(db.Float) # Consider db.Numeric for precision with monetary values or exact measurements
    year_built = db.Column(db.Integer, nullable=True)
    amenities = db.Column(db.Text, nullable=True) # Can store as comma-separated string or JSON string
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationship to images
    # lazy=True is the default and loads images when property.images is accessed.
    # cascade="all, delete-orphan" means images are deleted when the property is deleted.
    images = db.relationship('Image', backref='property', lazy=True, cascade="all, delete-orphan")

    def serialize(self):
        return {
            'id': str(self.id),
            'title': self.title,
            'description': self.description,
            # 'user': self.user.serialize() if self.user else None, # Requires user relationship to be loaded
            'price': self.price,
            'location': {
                'address': self.address,
                'city': self.city,
                'state': self.state,
                'zipCode': self.zip_code,
                'latitude': self.latitude,
                'longitude': None,  # Add if you have longitude data
            },
            'propertyType': self.property_type,
            'status': self.status,
            'features': {
                'bedrooms': self.bedrooms,
                'bathrooms': self.bathrooms,
                'area': self.area,
                'yearBuilt': self.year_built,
                'parking': None, # Add if you have parking data
            },
            # Assuming amenities are stored as a comma-separated string
            # If stored as JSON, you might use json.loads(self.amenities)
            'amenities': [amenity.strip() for amenity in self.amenities.split(',')] if self.amenities else [],
            'images': [img.url for img in self.images] if self.images else [],
            'ownerId': str(self.user_id),
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
            'isFeatured': False # Add logic if you have a way to determine this
        }

class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'), nullable=False)
    url = db.Column(db.String(200), nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'property_id': self.property_id,
            'url': self.url
        }

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.Text, nullable=False)
    chat_id = db.Column(db.Integer, db.ForeignKey('chat.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) # User who sent this message
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def serialize(self):
        return {
            'id': self.id,
            'message': self.message,
            'chat_id': self.chat_id,
            'sender_id': self.sender_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    messages = db.relationship('Message', backref='chat', lazy=True)
    # Link to the Inquiry that originated this chat (if any)
    inquiry_id = db.Column(db.Integer, db.ForeignKey('inquiry.id'), nullable=True, unique=True)
    inquiry = db.relationship('Inquiry', foreign_keys=[inquiry_id], backref=db.backref('chat', uselist=False))
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) # Initial sender of the chat (inquirer)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) # Initial receiver of the chat (property owner)
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'), nullable=False)
    property = db.relationship('Property', foreign_keys=[property_id])
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    is_read = db.Column(db.Boolean, default=False, nullable=False) # Has the recipient of the last message read it?
    last_message_sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True) # Who sent the very last message

    def serialize(self, include_property=False):
        return {
            'id': self.id,
            'sender_id': self.sender_id,
            'receiver_id': self.receiver_id,
            'property_id': self.property_id,
            'is_read': self.is_read,
            'last_message_sender_id': self.last_message_sender_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            # You might want to include message_ids or inquiry_id if needed, e.g.:
            'property': self.property.serialize() if include_property and self.property else None,
        # 'message_ids': [msg.id for msg in self.messages],
        # 'inquiry_id': self.inquiry.id if self.inquiry else None
        }

class Inquiry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    message = db.Column(db.Text, nullable=False)
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True) # User who made the inquiry, if registered
    status = db.Column(db.String(50), default='pending', nullable=False) # e.g., pending, responded, closed
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc)) # This default is used
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationship to Property
    property = db.relationship('Property', backref=db.backref('inquiries', lazy='dynamic'))

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'message': self.message,
            'property_id': self.property_id, # Keep this for direct access
            'property': self.property.serialize() if self.property else None, # Keep serialized property for convenience
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'user_id': self.user_id,
            'status': self.status
        }
class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    # Add any additional fields as necessary
    # For example, you might want to track when the favorite was added or updated

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'property_id': self.property_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
