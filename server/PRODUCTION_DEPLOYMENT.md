# Production Deployment Guide

## SQLite in Production: Important Considerations

**Yes, your data will be saved to SQLite**, but there are important things to know depending on where you host:

### ✅ SQLite Works Great For:
- **VPS/Cloud Servers** (DigitalOcean, AWS EC2, Linode, etc.)
  - Full filesystem access
  - Persistent storage
  - Single process/worker
  - Perfect for small to medium traffic

- **Dedicated Servers**
  - Full control over filesystem
  - Works perfectly

### ⚠️ SQLite Has Limitations On:
- **Heroku** - Filesystem is ephemeral (data gets deleted on restart)
- **Vercel/Netlify Functions** - Serverless, no persistent filesystem
- **Railway/Render** - Can work but filesystem may be ephemeral
- **Multiple Workers** - SQLite doesn't handle concurrent writes well

## Recommended Hosting Options for SQLite

### Option 1: VPS/Cloud Server (Best for SQLite)
**Recommended Services:**
- **DigitalOcean Droplet** ($6/month) - Simple, reliable
- **AWS EC2** - More complex but scalable
- **Linode** - Good alternative
- **Hetzner** - Very affordable in Europe

**Setup:**
1. Deploy your Flask app
2. SQLite database file persists on the server
3. Regular backups recommended (just copy the `.db` file)

### Option 2: Railway/Render (Works with SQLite)
- Both support persistent volumes
- Make sure to use persistent storage option
- Single worker/process recommended

## If You Need a Production Database

If you're deploying to Heroku, Vercel, or need multiple workers, consider these free options:

### Free Database Options:

1. **Supabase** (PostgreSQL) - Free tier, 500MB database
   - Easy to set up
   - Great free tier
   - Can easily migrate from SQLite

2. **PlanetScale** (MySQL) - Free tier available
   - Serverless MySQL
   - Good free tier

3. **Neon** (PostgreSQL) - Free tier, serverless
   - PostgreSQL with generous free tier

4. **SQLite with External Storage** (Advanced)
   - Store SQLite file in S3/Cloud Storage
   - Download on startup, upload on changes
   - More complex but keeps SQLite

## Current Setup (SQLite)

Your current setup will work perfectly if you:
- Deploy to a VPS/cloud server
- Use a single worker/process
- Have persistent filesystem access

**The database file location:**
- Local: `server/submissions.db`
- Production: Same location (in your server directory)

## Backup Strategy

**Important:** Always backup your database!

1. **Manual Backup:**
   ```bash
   # Just copy the file
   cp server/submissions.db server/backups/submissions-$(date +%Y%m%d).db
   ```

2. **Automated Backup Script:**
   - Set up a cron job to backup daily
   - Or use your hosting provider's backup service

3. **Export to CSV:**
   ```python
   # You can export anytime
   from services.database import get_all_submissions
   import csv
   
   submissions = get_all_submissions()
   with open('backup.csv', 'w', newline='') as f:
       writer = csv.DictWriter(f, fieldnames=submissions[0].keys())
       writer.writeheader()
       writer.writerows(submissions)
   ```

## Migration Path (If Needed)

If you need to switch to PostgreSQL/MySQL later, the migration is straightforward:

1. Export data from SQLite
2. Import to new database
3. Update `database.py` to use new database library
4. Update connection string in `.env`

The code structure makes this easy - just swap out the database service.

## Recommendation

**For your use case (form submissions):**
- **SQLite is perfect** if you deploy to a VPS or cloud server
- **Simple, free, and reliable** for small to medium traffic
- **Easy to backup** (just copy one file)
- **No external dependencies** or API keys needed

If you're planning to deploy to Heroku/Vercel, let me know and I can help you set up a free PostgreSQL database instead!

