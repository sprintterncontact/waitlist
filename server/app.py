from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Get the directory where this file is located
basedir = os.path.abspath(os.path.dirname(__file__))

# Load environment variables from .env file in the server directory
env_path = os.path.join(basedir, '.env')
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Import and register routes
from routes import api
app.register_blueprint(api)

if __name__ == '__main__':
    # Use FLASK_PORT to avoid confusion with database ports
    # Default to 5000 for the web server
    port = int(os.environ.get('FLASK_PORT', os.environ.get('PORT', 5000)))
    
    # Sanity check: 5432 is PostgreSQL default port, not a web server port
    if port == 5432:
        print("WARNING: Port 5432 is the PostgreSQL default port. Using port 5000 for web server instead.")
        port = 5000
    
    # Only run in debug mode if explicitly set (not in production)
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    print(f"Starting Flask server on port {port}")
    app.run(debug=debug_mode, host='0.0.0.0', port=port)

