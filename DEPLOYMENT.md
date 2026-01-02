# Deployment Guide - Render.com Free Hosting

This guide will walk you through deploying your React + Flask application to Render.com for free.

## Prerequisites

- A GitHub account
- A Render.com account (free tier available)
- Your code pushed to a GitHub repository
- Gmail app password (for email functionality)

## Step 1: Prepare Your Code

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Verify your `render.yaml` is in the root directory**
   - The file should be at the root of your repository
   - It contains configuration for both backend and frontend services

## Step 2: Create Render.com Account

1. Go to [render.com](https://render.com)
2. Sign up for a free account (you can use GitHub to sign in)
3. Verify your email address

## Step 3: Connect GitHub Repository

1. In Render dashboard, click **"New +"** → **"Blueprint"**
2. Select **"Public Git repository"**
3. Connect your GitHub account if not already connected
4. Select your repository
5. Render will automatically detect the `render.yaml` file

## Step 4: Review and Deploy Services

Render will create two services based on your `render.yaml`:

### Backend Service (`firsttask-backend`)
- **Type**: Web Service
- **Environment**: Python 3.11
- **Build Command**: `cd server && pip install -r requirements.txt`
- **Start Command**: `cd server && gunicorn app:app --bind 0.0.0.0:$PORT`
- **Health Check**: `/health` endpoint

### Frontend Service (`firsttask-frontend`)
- **Type**: Static Site
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `./build`

## Step 5: Configure Environment Variables

### Backend Environment Variables

In the Render dashboard, go to your **backend service** → **Environment** tab and add:

1. **GMAIL_EMAIL**
   - Your Gmail address (e.g., `yourname@gmail.com`)
   - Click "Add Environment Variable"
   - Set as **Secret** (recommended)

2. **GMAIL_APP_PASSWORD**
   - Your Gmail app password (not your regular password)
   - To generate:
     1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
     2. Enable 2-Step Verification if not already enabled
     3. Generate a new app password for "Mail"
     4. Copy the 16-character password
   - Set as **Secret** (required)

3. **OWNER_EMAIL**
   - Email address where you want to receive notification emails
   - Can be the same as GMAIL_EMAIL or different
   - Set as **Secret** (recommended)

4. **PYTHON_VERSION**
   - Already set in `render.yaml` to `3.11`
   - No action needed

### Frontend Environment Variables

In the Render dashboard, go to your **frontend service** → **Environment** tab:

1. **REACT_APP_API_URL**
   - Will be automatically set to: `https://firsttask-backend.onrender.com`
   - **Important**: After your backend deploys, copy its URL and update this value
   - The URL format is: `https://[service-name].onrender.com`

## Step 6: Deploy

1. **Backend Deployment**
   - Render will automatically start building and deploying
   - Wait for the build to complete (usually 2-5 minutes)
   - Check the **Logs** tab for any errors
   - Once deployed, note the service URL (e.g., `https://firsttask-backend.onrender.com`)

2. **Update Frontend API URL**
   - Go to frontend service → **Environment** tab
   - Update `REACT_APP_API_URL` with your actual backend URL
   - Save changes (this will trigger a rebuild)

3. **Frontend Deployment**
   - The frontend will rebuild automatically
   - Wait for deployment to complete
   - Your site will be available at: `https://firsttask-frontend.onrender.com`

## Step 7: Test Your Deployment

1. **Test Health Endpoint**
   - Visit: `https://firsttask-backend.onrender.com/health`
   - Should return: `{"status":"healthy","service":"firsttask-backend"}`

2. **Test Form Submission**
   - Visit your frontend URL
   - Fill out and submit the form
   - Check:
     - ✅ Form submission succeeds
     - ✅ Confirmation email received
     - ✅ Notification email received
     - ✅ Data saved in database

3. **Check Logs**
   - Backend service → **Logs** tab
   - Look for any errors or warnings

## Troubleshooting

### Backend Issues

**Problem**: Build fails
- **Solution**: Check logs for missing dependencies. Ensure `requirements.txt` includes all packages.

**Problem**: Service won't start
- **Solution**: 
  - Verify `gunicorn` is in `requirements.txt`
  - Check that `startCommand` in `render.yaml` is correct
  - Review logs for specific error messages

**Problem**: Database not persisting
- **Solution**: 
  - Verify disk mount path in `render.yaml` matches: `/opt/render/project/src/server`
  - Check that disk is attached in Render dashboard → **Disks** tab

**Problem**: Email not sending
- **Solution**:
  - Verify `GMAIL_EMAIL` and `GMAIL_APP_PASSWORD` are set correctly
  - Ensure you're using an app password, not your regular Gmail password
  - Check logs for SMTP errors

### Frontend Issues

**Problem**: API calls failing
- **Solution**:
  - Verify `REACT_APP_API_URL` matches your backend URL exactly
  - Check browser console for CORS errors
  - Ensure backend has CORS enabled (already configured in `app.py`)

**Problem**: Build fails
- **Solution**:
  - Check that `package.json` is in the root directory
  - Verify Node.js version compatibility
  - Review build logs for specific errors

### General Issues

**Problem**: Service spins down after inactivity
- **This is normal on free tier**
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds (cold start)
- **Solution**: See "Minimizing Spin-Down Delays" below

**Problem**: Service URL not working
- **Solution**:
  - Wait a few minutes after deployment
  - Check service status in Render dashboard
  - Verify service is not suspended (free tier has limits)

## Minimizing Spin-Down Delays

On Render's free tier, services spin down after 15 minutes of inactivity. Here are ways to minimize this:

### Option 1: External Monitoring Service (Recommended - Free)

Use a free uptime monitoring service to ping your health endpoint:

1. **UptimeRobot** (free tier available)
   - Sign up at [uptimerobot.com](https://uptimerobot.com)
   - Add a new monitor:
     - Type: HTTP(s)
     - URL: `https://firsttask-backend.onrender.com/health`
     - Interval: 5 minutes (free tier limit)
   - This will keep your service alive

2. **Cron-Job.org** (free tier available)
   - Sign up at [cron-job.org](https://cron-job.org)
   - Create a new cron job:
     - URL: `https://firsttask-backend.onrender.com/health`
     - Schedule: Every 10 minutes
   - This will ping your service regularly

### Option 2: Upgrade to Paid Tier

- Render's paid tier ($7/month per service) keeps services always-on
- No spin-down delays
- Better for production applications

### Option 3: Accept Cold Starts

- Free tier is perfect for low-traffic applications
- 30-60 second delay on first request after inactivity is acceptable for many use cases
- No additional setup required

## Database Management

### Viewing Submissions

Your SQLite database is stored on a persistent disk. To view submissions:

1. **Using Render Shell** (if available on your plan)
   - Connect via SSH to your backend service
   - Navigate to `/opt/render/project/src/server`
   - Use SQLite CLI: `sqlite3 submissions.db`

2. **Download Database File**
   - Render dashboard → Backend service → **Disks** tab
   - Download the database file
   - Open with [DB Browser for SQLite](https://sqlitebrowser.org/)

3. **Add Admin Endpoint** (optional)
   - You can add a protected endpoint to view submissions via API
   - Requires authentication for security

### Backing Up Database

- The database file is automatically persisted on Render's disk
- For additional backup, periodically download the database file
- Or set up automated backups via Render's backup features (if available)

## Monitoring and Maintenance

### View Logs

- **Backend**: Service → **Logs** tab
- **Frontend**: Service → **Logs** tab
- Logs are available in real-time

### Service Status

- Check service health in Render dashboard
- Monitor uptime and response times
- Set up email alerts for service failures (available in paid tier)

### Updates and Redeployments

1. Push changes to GitHub
2. Render automatically detects changes
3. Services rebuild and redeploy automatically
4. Environment variables persist across deployments

## Free Tier Limitations

- **750 hours/month** of compute time (shared across services)
- **Services spin down** after 15 minutes of inactivity
- **Cold start delay**: 30-60 seconds after spin-down
- **Limited bandwidth**: Sufficient for most small applications
- **No custom domains** on free tier (can use Render subdomain)

## Cost Estimate

- **Current setup**: $0/month (free tier)
- **If you need always-on**: $14/month ($7 × 2 services)
- **Database**: Included (SQLite on disk, no additional cost)

## Next Steps

1. ✅ Deploy to Render.com
2. ✅ Test all functionality
3. ✅ Set up uptime monitoring (optional)
4. ✅ Monitor logs for first few days
5. ✅ Consider custom domain (requires paid tier)

## Support Resources

- [Render Documentation](https://render.com/docs)
- [Render Community Forum](https://community.render.com)
- [Render Status Page](https://status.render.com)

## Security Notes

- Never commit `.env` files to Git
- Use Render's secret environment variables for sensitive data
- Keep your Gmail app password secure
- Regularly rotate app passwords
- Monitor logs for suspicious activity

---

**Last Updated**: Based on current Render.com free tier (as of 2024)

