import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def get_smtp_server():
    """
    Create and return SMTP server connection.
    Uses Gmail SMTP settings from environment variables.
    """
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    sender_email = os.environ.get('GMAIL_EMAIL', '').strip()
    sender_password = os.environ.get('GMAIL_APP_PASSWORD', '').strip()
    
    # Remove spaces from password (Gmail app passwords are 16 chars, no spaces)
    sender_password = sender_password.replace(' ', '')
    
    if not sender_email or not sender_password:
        raise ValueError("GMAIL_EMAIL and GMAIL_APP_PASSWORD must be set in environment variables")
    
    if len(sender_password) != 16:
        raise ValueError(f"Gmail app password should be 16 characters (got {len(sender_password)}). Make sure you're using an App Password, not your regular Gmail password. Generate one at: https://myaccount.google.com/apppasswords")
    
    # Create SMTP connection
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        return server
    except smtplib.SMTPAuthenticationError as e:
        raise ValueError(f"Gmail authentication failed. Please check:\n1. Your Gmail address is correct: {sender_email}\n2. You're using an App Password (not your regular password)\n3. 2-Step Verification is enabled\n4. Generate a new app password at: https://myaccount.google.com/apppasswords\n\nError: {str(e)}")

def send_confirmation_email(recipient_email, form_data):
    """
    Send confirmation email to the form submitter.
    Includes thank you message and call setup request.
    
    Args:
        recipient_email (str): Email address of the submitter
        form_data (dict): Form submission data
    
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Get SMTP server
        server = get_smtp_server()
        
        # Create email message
        msg = MIMEMultipart()
        sender_email = os.environ.get('GMAIL_EMAIL')
        task_description = form_data.get('taskDescription', 'your task')
        company_name = form_data.get('companyName', 'your company')
        
        msg['From'] = sender_email
        msg['To'] = recipient_email
        msg['Subject'] = "Thank you for requesting pilot access - Let's schedule a call"
        
        # Create email body asking for available times
        body = f"""Hi there,

Thank you for your interest in Sprinttern!

We've received your request for pilot access. We're excited about helping {company_name} with {task_description}.

To move forward, we'd love to schedule a quick call to discuss your needs in more detail and answer any questions you might have.

Could you please let us know what times you're free for a call? Please reply to this email with:
- Your preferred days of the week
- Your preferred times (and timezone)
- Any days/times that don't work for you

We'll coordinate a time that works for both of us.

Looking forward to speaking with you!

Best regards,
The FirstTask Team
"""
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email
        server.send_message(msg)
        server.quit()
        
        return True
    except Exception as e:
        print(f"Error sending confirmation email: {e}")
        raise

def send_notification_email(owner_email, form_data):
    """
    Send notification email to business owner about new submission.
    
    Args:
        owner_email (str): Email address of the business owner
        form_data (dict): Form submission data
    
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Get SMTP server
        server = get_smtp_server()
        
        # Create email message
        msg = MIMEMultipart()
        sender_email = os.environ.get('GMAIL_EMAIL')
        company_name = form_data.get('companyName', 'Unknown')
        msg['From'] = sender_email
        msg['To'] = owner_email
        msg['Subject'] = f"New Pilot Access Request - {company_name}"
        
        # Create email body with all form details
        body = f"""New form submission received:

Company Name: {form_data.get('companyName', 'N/A')}
Role: {form_data.get('role', 'N/A')}
Email: {form_data.get('email', 'N/A')}
Website/LinkedIn: {form_data.get('website', 'N/A')}

Task Description:
{form_data.get('taskDescription', 'N/A')}

Timeline: {form_data.get('timeline', 'N/A')}
Budget Range: {form_data.get('budget', 'N/A')}

---
You can reply directly to {form_data.get('email', 'N/A')} to follow up.
"""
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email
        server.send_message(msg)
        server.quit()
        
        return True
    except Exception as e:
        print(f"Error sending notification email: {e}")
        raise

