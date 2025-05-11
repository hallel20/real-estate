from flask import current_app
from flask_mail import Mail, Message

mail = Mail() #initialize

def send_welcome_email(email, username):
    """Sends a welcome email to the user."""
    subject = "Welcome to Our Real Estate Platform"
    body = f"Hello {username},\n\nThank you for registering with us! We're excited to have you on board.\n\nBest regards,\nReal Estate Team"
    send_email(email, subject, body)


def send_password_reset_email(email, token):
    """Sends a password reset email to the user."""
    subject = "Password Reset Request"
    reset_link = f"http://yourfrontend.com/reset-password?token={token}"
    body = f"To reset your password, click the following link: {reset_link}\n\nIf you did not request this, please ignore this email."
    send_email(email, subject, body)


def send_inquiry_notification_email(agent_email, inquiry_id):
    """Sends a notification email to the agent about a new inquiry."""
    subject = "New Property Inquiry"
    body = f"You have received a new inquiry. Please check the details for inquiry ID: {inquiry_id}."
    send_email(agent_email, subject, body)


def send_email(to, subject, body):
    """Sends an email using Flask-Mail."""
    msg = Message(subject=subject, recipients=[to])
    msg.body = body
    try:
        mail.send(msg)
    except Exception as e:
        print(f"Error sending email: {e}") #log the error
        # Consider more sophisticated error handling here, such as logging
        # the error and possibly retrying a few times before giving up.
        raise #re-raise