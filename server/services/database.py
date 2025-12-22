import sqlite3
import os
from datetime import datetime

# Database file path - can be overridden with DB_PATH environment variable
_default_db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'submissions.db')
DB_PATH = os.environ.get('DB_PATH', _default_db_path)

def init_database():
    """
    Initialize the database and create table if it doesn't exist.
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create submissions table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            company_name TEXT NOT NULL,
            role TEXT NOT NULL,
            email TEXT NOT NULL,
            website TEXT,
            task_description TEXT NOT NULL,
            timeline TEXT NOT NULL,
            budget TEXT NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()

def save_submission(form_data):
    """
    Save form submission to SQLite database.
    
    Args:
        form_data (dict): Form data with keys:
            - companyName
            - role
            - email
            - website
            - taskDescription
            - timeline
            - budget
    
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Initialize database if needed
        init_database()
        
        # Connect to database
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Prepare data
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Insert submission
        cursor.execute('''
            INSERT INTO submissions (
                timestamp, company_name, role, email, website,
                task_description, timeline, budget
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            timestamp,
            form_data.get('companyName', ''),
            form_data.get('role', ''),
            form_data.get('email', ''),
            form_data.get('website', ''),
            form_data.get('taskDescription', ''),
            form_data.get('timeline', ''),
            form_data.get('budget', '')
        ))
        
        conn.commit()
        conn.close()
        
        return True
    except Exception as e:
        print(f"Error saving to database: {e}")
        raise

def get_all_submissions():
    """
    Get all submissions from the database.
    Useful for viewing/managing submissions.
    
    Returns:
        list: List of submission dictionaries
    """
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM submissions ORDER BY timestamp DESC
        ''')
        
        rows = cursor.fetchall()
        conn.close()
        
        # Convert to list of dictionaries
        submissions = []
        for row in rows:
            submissions.append({
                'id': row[0],
                'timestamp': row[1],
                'companyName': row[2],
                'role': row[3],
                'email': row[4],
                'website': row[5],
                'taskDescription': row[6],
                'timeline': row[7],
                'budget': row[8]
            })
        
        return submissions
    except Exception as e:
        print(f"Error getting submissions: {e}")
        raise

