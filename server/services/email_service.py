from flask import current_app
from flask_mail import Mail, Message

mail = Mail() # Define the Mail instance here; it will be initialized by app.py

def send_welcome_email(email, username):
    """Sends a welcome email to the user."""
    subject = "Welcome to Our Real Estate Platform"
    body = f"Hello {username},\n\nThank you for registering with us! We're excited to have you on board.\n\nBest regards,\nReal Estate Team"
    send_email(email, subject, body)


def send_password_reset_email(email, token):
    """Sends a password reset email to the user."""
    subject = "Password Reset Request"
    frontend_url = current_app.config.get('FRONTEND_URL', 'http://localhost:3000') # Fallback if not configured
    reset_link = f"{frontend_url}/reset-password?token={token}"
    body = f"To reset your password, click the following link: {reset_link}\n\nIf you did not request this, please ignore this email."
    send_email(email, subject, body)


def send_inquiry_notification_email(agent_email, inquiry_id):
    """Sends a notification email to the agent about a new inquiry."""
    subject = "New Property Inquiry"
    body = f"You have received a new inquiry. Please check the details for inquiry ID: {inquiry_id}."
    send_email(agent_email, subject, body)


def send_email(to, subject, body):
    """Sends an email using Flask-Mail."""
    # Use MAIL_DEFAULT_SENDER from app config, fallback to MAIL_USERNAME
    sender_email = current_app.config.get('MAIL_DEFAULT_SENDER')
    if not sender_email: # If MAIL_DEFAULT_SENDER is None or empty string
        sender_email = current_app.config.get('MAIL_USERNAME')

    if not sender_email:
        current_app.logger.error("Email sender (MAIL_DEFAULT_SENDER or MAIL_USERNAME) is not configured.")
        # Depending on your app's needs, you might raise an error here or return
        raise ValueError("Email sender not configured. Please set MAIL_DEFAULT_SENDER or MAIL_USERNAME in your environment.")

    msg = Message(subject=subject, recipients=[to], body=body, sender=sender_email)
    try:
        mail.send(msg)
    except Exception as e:
        current_app.logger.error(f"Error sending email to {to} with subject '{subject}': {e}")
        raise #re-raise