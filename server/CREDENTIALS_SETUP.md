# Credentials Setup Guide

## Step 1: Create Your .env File

Create a file named `.env` in the `server/` directory with the following template:

```env
# Gmail SMTP Configuration
GMAIL_EMAIL=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password-here

# Business Owner Email
OWNER_EMAIL=owner@example.com

# Server Configuration (optional)
PORT=5000
```

## Step 2: Get Gmail App Password

1. **Go to your Google Account**: https://myaccount.google.com/
2. **Enable 2-Step Verification** (if not already enabled):
   - Go to Security → 2-Step Verification
   - Follow the setup process
3. **Create App Password**:
   - Go to Security → App passwords (or visit: https://myaccount.google.com/apppasswords)
   - Select "Mail" as the app
   - Select "Other (Custom name)" as the device
   - Enter "FirstTask Backend" as the name
   - Click "Generate"
   - Copy the 16-character password (spaces don't matter)
4. **Add to .env**:
   - `GMAIL_EMAIL`: Your Gmail address
   - `GMAIL_APP_PASSWORD`: The 16-character app password you just generated

## Step 3: Set Business Owner Email

- `OWNER_EMAIL`: The email address where you want to receive notifications about new form submissions
- This can be the same as your Gmail email or a different one

## Step 4: Database Setup (Automatic!)

**No setup required!** The application uses SQLite, which is built into Python. 

- The database file (`submissions.db`) will be automatically created in the `server/` directory when you first run the application
- All form submissions will be stored there automatically
- You can view the data using any SQLite browser (like DB Browser for SQLite) or export it to CSV/Excel

### Optional: View Your Submissions

You can view your submissions using:

1. **DB Browser for SQLite** (free): https://sqlitebrowser.org/
   - Open `server/submissions.db`
   - Browse the `submissions` table

2. **Command line** (if you have SQLite installed):
   ```bash
   sqlite3 server/submissions.db
   SELECT * FROM submissions;
   ```

3. **Python script** (you can create a simple viewer):
   ```python
   from services.database import get_all_submissions
   submissions = get_all_submissions()
   for sub in submissions:
       print(sub)
   ```

## Summary of Credentials Needed

| Credential | Where to Get It | Example |
|------------|----------------|---------|
| `GMAIL_EMAIL` | Your Gmail address | `yourname@gmail.com` |
| `GMAIL_APP_PASSWORD` | Google Account → App Passwords | `abcd efgh ijkl mnop` |
| `OWNER_EMAIL` | Your email for notifications | `yourname@gmail.com` |

**That's it!** No database setup, no API keys, no external services needed.

## Testing Your Setup

Once you've filled in all credentials:

1. Start the Flask server:
   ```bash
   cd server
   python app.py
   ```

2. You should see: `Running on http://0.0.0.0:5000`

3. Test by submitting the form from your React app, or use curl:
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

4. Check that:
   - ✅ Confirmation email sent to submitter
   - ✅ Notification email sent to you
   - ✅ Data saved in `server/submissions.db`

## Troubleshooting

- **"Invalid credentials"**: Check that your Gmail app password is correct (no spaces needed)
- **"Module not found"**: Run `pip install -r requirements.txt`
- **Database file not created**: Make sure the `server/` directory is writable
- **Email not sending**: Verify your Gmail app password is correct and 2-step verification is enabled

## Benefits of SQLite

✅ **Free** - No cost, no limits  
✅ **No setup** - Works immediately  
✅ **Local storage** - Your data stays on your server  
✅ **Easy backup** - Just copy the `.db` file  
✅ **Fast** - Perfect for small to medium projects  
✅ **Portable** - Can export to CSV/Excel anytime  
