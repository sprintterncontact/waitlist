from flask import Blueprint, request, jsonify
from services.database import save_submission, get_all_submissions
from services.email import send_confirmation_email, send_notification_email
import os

# Create blueprint for routes
api = Blueprint('api', __name__)

@api.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint for Render.com monitoring.
    Returns 200 OK to indicate the service is running.
    """
    return jsonify({
        'status': 'healthy',
        'service': 'firsttask-backend'
    }), 200

@api.route('/api/submit', methods=['POST'])
def submit_form():
    """
    Handle form submission:
    1. Validate form data
    2. Save to database
    3. Send confirmation email to submitter
    4. Send notification email to business owner
    """
    try:
        # Get form data from request
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        # Validate required fields
        required_fields = ['companyName', 'role', 'email', 'taskDescription', 'timeline', 'budget']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                'success': False,
                'message': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400
        
        # Validate email format
        email = data.get('email', '')
        if '@' not in email or '.' not in email.split('@')[1]:
            return jsonify({
                'success': False,
                'message': 'Invalid email format'
            }), 400
        
        # Save to database
        save_submission(data)
        
        # Send confirmation email to submitter
        send_confirmation_email(data['email'], data)
        
        # Send notification email to business owner
        # Use OWNER_EMAIL if set, otherwise fall back to GMAIL_EMAIL
        owner_email = os.environ.get('OWNER_EMAIL') or os.environ.get('GMAIL_EMAIL')
        if owner_email:
            send_notification_email(owner_email, data)
        else:
            print("Warning: Neither OWNER_EMAIL nor GMAIL_EMAIL is set, skipping notification email")
        
        return jsonify({
            'success': True,
            'message': 'Form submitted successfully'
        }), 200
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/api/submissions', methods=['GET'])
def get_submissions():
    """
    Get all submissions (protected by simple API key).
    Pass ?key=YOUR_ADMIN_KEY to access.
    """
    try:
        admin_key = os.environ.get('ADMIN_KEY')
        provided_key = request.args.get('key')
        
        if not admin_key:
            return jsonify({
                'success': False,
                'message': 'Admin access not configured'
            }), 403
        
        if provided_key != admin_key:
            return jsonify({
                'success': False,
                'message': 'Unauthorized'
            }), 401
        
        submissions = get_all_submissions()
        return jsonify({
            'success': True,
            'count': len(submissions),
            'submissions': submissions
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500

