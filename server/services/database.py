import psycopg2
from psycopg2 import pool
import os
from datetime import datetime

# Database connection string from environment variable
DATABASE_URL = os.environ.get('DATABASE_URL')

# Connection pool for production use
_connection_pool = None

def get_connection():
    """
    Get a database connection from the pool or create a new one.
    """
    global _connection_pool
    
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable is not set")
    
    # Create connection pool if it doesn't exist
    if _connection_pool is None:
        try:
            _connection_pool = psycopg2.pool.SimpleConnectionPool(
                1,  # min connections
                5,  # max connections
                DATABASE_URL
            )
        except Exception as e:
            print(f"Error creating connection pool: {e}")
            raise
    
    # Get connection from pool
    try:
        return _connection_pool.getconn()
    except Exception as e:
        print(f"Error getting connection from pool: {e}")
        # Fallback to direct connection if pool fails
        return psycopg2.connect(DATABASE_URL)

def return_connection(conn):
    """
    Return a connection to the pool.
    """
    global _connection_pool
    if _connection_pool:
        _connection_pool.putconn(conn)
    else:
        conn.close()

def init_database():
    """
    Initialize the database and create table if it doesn't exist.
    """
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        # Create submissions table if it doesn't exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS submissions (
                id SERIAL PRIMARY KEY,
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
        cursor.close()
    except Exception as e:
        print(f"Error initializing database: {e}")
        raise
    finally:
        if conn:
            return_connection(conn)

def save_submission(form_data):
    """
    Save form submission to PostgreSQL database.
    
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
    conn = None
    try:
        # Initialize database if needed
        init_database()
        
        # Get connection
        conn = get_connection()
        cursor = conn.cursor()
        
        # Prepare data
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Insert submission
        cursor.execute('''
            INSERT INTO submissions (
                timestamp, company_name, role, email, website,
                task_description, timeline, budget
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
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
        cursor.close()
        
        return True
    except Exception as e:
        print(f"Error saving to database: {e}")
        raise
    finally:
        if conn:
            return_connection(conn)

def get_all_submissions():
    """
    Get all submissions from the database.
    Useful for viewing/managing submissions.
    
    Returns:
        list: List of submission dictionaries
    """
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM submissions ORDER BY timestamp DESC
        ''')
        
        rows = cursor.fetchall()
        cursor.close()
        
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
    finally:
        if conn:
            return_connection(conn)
