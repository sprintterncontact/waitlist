# Flask Backend Setup

## Installation

1. **Install Python dependencies:**
   ```bash
   cd server
   pip install -r requirements.txt
   ```

   Or if using a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

## Configuration

1. **Copy the environment template:**
   ```bash
   cp env.template .env
   ```
   Or create `.env` manually in the `server/` directory.

2. **Set up Gmail App Password:**
   - Go to your Google Account settings
   - Enable 2-Step Verification
   - Go to App Passwords
   - Generate a new app password for "Mail"
   - Add it to `.env` as `GMAIL_APP_PASSWORD`

3. **Fill in `.env` file:**
   ```env
   GMAIL_EMAIL=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-app-password
   OWNER_EMAIL=owner@example.com
   PORT=5000
   ```

## Database

**No setup required!** The application uses SQLite, which is built into Python.

- The database file (`submissions.db`) will be automatically created in the `server/` directory when you first run the application
- All form submissions are stored automatically
- You can view the data using any SQLite browser (like DB Browser for SQLite) or export it to CSV/Excel

## Running the Server

```bash
python app.py
```

The server will run on `http://localhost:5000` by default.

## Testing

Test the endpoint:
```bash
curl -X POST http://localhost:5000/api/submit \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Company",
    "role": "CEO",
    "email": "test@example.com",
    "website": "https://example.com",
    "taskDescription": "Test task",
    "timeline": "this-month",
    "budget": "150+"
  }'
```

## Viewing Submissions

You can view your submissions using:

1. **DB Browser for SQLite** (free): https://sqlitebrowser.org/
   - Open `server/submissions.db`
   - Browse the `submissions` table

2. **Command line** (if you have SQLite installed):
   ```bash
   sqlite3 server/submissions.db
   SELECT * FROM submissions;
   ```

3. **Python script**:
   ```python
   from services.database import get_all_submissions
   submissions = get_all_submissions()
   for sub in submissions:
       print(sub)
   ```

## Troubleshooting

- **"Invalid credentials"**: Check that your Gmail app password is correct
- **"Module not found"**: Run `pip install -r requirements.txt`
- **Database file not created**: Make sure the `server/` directory is writable
- **Email not sending**: Verify your Gmail app password is correct and 2-step verification is enabled
