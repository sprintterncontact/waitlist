import os
import sqlite3
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ.get('DATABASE_URL')
DB_PATH = os.environ.get('DB_PATH', './submissions.db')

_use_sqlite = False
_connection_pool = None


def _test_postgres_connection():
    if not DATABASE_URL:
        return False
    try:
        import psycopg2
        conn = psycopg2.connect(DATABASE_URL, connect_timeout=5)
        conn.close()
        return True
    except Exception as e:
        print(f"PostgreSQL connection failed: {e}")
        return False


def _init_backend():
    global _use_sqlite
    if DATABASE_URL and _test_postgres_connection():
        print("Using PostgreSQL database")
        _use_sqlite = False
    else:
        print("PostgreSQL unavailable, using SQLite fallback")
        _use_sqlite = True


_init_backend()


def get_connection():
    global _connection_pool, _use_sqlite
    if _use_sqlite:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn
    else:
        import psycopg2
        from psycopg2 import pool
        if _connection_pool is None:
            try:
                _connection_pool = psycopg2.pool.SimpleConnectionPool(1, 5, DATABASE_URL)
            except Exception as e:
                print(f"PostgreSQL pool error: {e}")
                _use_sqlite = True
                return get_connection()
        try:
            return _connection_pool.getconn()
        except Exception as e:
            print(f"PostgreSQL error: {e}")
            _use_sqlite = True
            return get_connection()


def return_connection(conn):
    global _connection_pool, _use_sqlite
    if _use_sqlite:
        conn.close()
    elif _connection_pool:
        _connection_pool.putconn(conn)
    else:
        conn.close()


def init_database():
    global _use_sqlite
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        if _use_sqlite:
            cursor.execute('''CREATE TABLE IF NOT EXISTS submissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL, company_name TEXT NOT NULL,
                role TEXT NOT NULL, email TEXT NOT NULL, website TEXT,
                task_description TEXT NOT NULL, timeline TEXT NOT NULL,
                budget TEXT NOT NULL)''')
        else:
            cursor.execute('''CREATE TABLE IF NOT EXISTS submissions (
                id SERIAL PRIMARY KEY,
                timestamp TEXT NOT NULL, company_name TEXT NOT NULL,
                role TEXT NOT NULL, email TEXT NOT NULL, website TEXT,
                task_description TEXT NOT NULL, timeline TEXT NOT NULL,
                budget TEXT NOT NULL)''')
        conn.commit()
        cursor.close()
    except Exception as e:
        print(f"Error initializing database: {e}")
        raise
    finally:
        if conn:
            return_connection(conn)


def save_submission(form_data):
    global _use_sqlite
    conn = None
    try:
        init_database()
        conn = get_connection()
        cursor = conn.cursor()
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        p = '?' if _use_sqlite else '%s'
        sql = f'INSERT INTO submissions (timestamp, company_name, role, email, website, task_description, timeline, budget) VALUES ({p}, {p}, {p}, {p}, {p}, {p}, {p}, {p})'
        cursor.execute(sql, (timestamp, form_data.get('companyName', ''),
            form_data.get('role', ''), form_data.get('email', ''),
            form_data.get('website', ''), form_data.get('taskDescription', ''),
            form_data.get('timeline', ''), form_data.get('budget', '')))
        conn.commit()
        cursor.close()
        print(f"Saved to {'SQLite' if _use_sqlite else 'PostgreSQL'}")
        return True
    except Exception as e:
        print(f"Error saving: {e}")
        raise
    finally:
        if conn:
            return_connection(conn)


def get_all_submissions():
    conn = None
    try:
        init_database()
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM submissions ORDER BY timestamp DESC')
        rows = cursor.fetchall()
        cursor.close()
        submissions = []
        for row in rows:
            submissions.append({'id': row[0], 'timestamp': row[1],
                'companyName': row[2], 'role': row[3], 'email': row[4],
                'website': row[5], 'taskDescription': row[6],
                'timeline': row[7], 'budget': row[8]})
        return submissions
    except Exception as e:
        print(f"Error getting submissions: {e}")
        raise
    finally:
        if conn:
            return_connection(conn)

