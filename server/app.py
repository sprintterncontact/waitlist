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
    port = int(os.environ.get('PORT', 5000))
    # Only run in debug mode if explicitly set (not in production)
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=port)

