# GitHub Actions Setup Guide - Database Ping

This guide will help you set up GitHub Actions to automatically ping your Supabase database to prevent it from being paused.

## What We've Created

1. **`scripts/ping-database.ts`** - Script that pings the database using Prisma
2. **`.github/workflows/ping-database.yml`** - GitHub Actions workflow that runs the ping script on a schedule
3. **`npm run ping:db`** - Command to test the ping script locally

## Step 1: Add GitHub Secrets

You need to add your database connection string as a secret in GitHub:

### Required Secret: DATABASE_URL

1. Go to your GitHub repository
2. Click on **Settings** (in the repository, not your account settings)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Set the following:
   - **Name**: `DATABASE_URL`
   - **Value**: Your database connection string from `.env.local`
     - It should look like: `postgresql://postgres.[project-ref]:[password]@aws-[region].pooler.supabase.com:5432/postgres`
     - **Important**: Use your actual connection string, not the example format
6. Click **Add secret**

### Optional Secrets: SUPABASE_PROJECT_REF and SUPABASE_ANON_KEY

These secrets are **optional** and only needed if you want to also ping the Supabase REST API. The workflow will work fine without them - it will just skip the REST API ping step.

If you want to enable REST API ping:
1. Follow the same steps above to add secrets
2. **Name**: `SUPABASE_PROJECT_REF` - Your Supabase project reference ID
3. **Name**: `SUPABASE_ANON_KEY` - Your Supabase anonymous/public API key

You can find these in your Supabase project settings under API.

## Step 2: Test Locally (Optional)

Before pushing to GitHub, you can test the ping script locally:

```bash
npm run ping:db
```

This should connect to your database and show:
- ✅ Article created successfully (with ID, title, author, slug)
- ✅ Article deleted successfully
- Timestamp

## Step 3: Push to GitHub

Commit and push the changes:

```bash
git add .
git commit -m "Add GitHub Actions workflow to prevent database pausing"
git push
```

## Step 4: Verify the Workflow

1. Go to your GitHub repository
2. Click on the **Actions** tab
3. You should see the "Ping Supabase to Prevent Pausing" workflow
4. You can manually trigger it by:
   - Going to Actions → Ping Supabase to Prevent Pausing
   - Clicking "Run workflow" button
   - Clicking "Run workflow" again

## Schedule Configuration

The workflow is currently set to run:
- **Every day at 9:00 AM UTC** (`0 9 * * *`)

To change the schedule, edit `.github/workflows/ping-database.yml` and modify the cron expression:
- Format: `minute hour day-of-month month day-of-week`
- Example: `0 9 * * *` = Every day at 9:00 AM UTC
- Example: `0 */6 * * *` = Every 6 hours
- Example: `0 9 * * 1,4` = Every Monday and Thursday at 9:00 AM UTC

## How It Works

1. GitHub Actions runs on the specified schedule
2. It installs dependencies and generates Prisma client
3. It runs the ping script which:
   - Creates a test article entry (title: "ping", author: "joseph kang", content: "test")
   - Immediately deletes the test article
   - This ensures real database write/delete activity, which Supabase counts as activity
4. This keeps your database active and prevents Supabase from pausing it

## Troubleshooting

### Workflow fails with "DATABASE_URL not set"
- Make sure you've added the secret in GitHub Settings → Secrets and variables → Actions
- Verify the secret name is exactly `DATABASE_URL` (case-sensitive)

### Workflow shows warning about REST API secrets
- This is **normal** and not an error! The workflow will continue and ping the database via Prisma
- If you want to enable REST API ping, add `SUPABASE_PROJECT_REF` and `SUPABASE_ANON_KEY` secrets (optional)

### Database connection error
- Verify your `DATABASE_URL` secret is correct
- Make sure you're using the pooler connection string (not direct)
- Check that your Supabase project is active
- **After migrating to a new database:** Update the `DATABASE_URL` secret in GitHub to point to your new database:
  1. Go to GitHub → Your Repository → Settings → Secrets and variables → Actions
  2. Find `DATABASE_URL` and click **Update**
  3. Replace with your new database connection string (should contain your new project ref, e.g., `buexhyqkvhtbsroebecm`)
  4. The format should be: `postgresql://postgres.[new-project-ref]:[password]@aws-1-us-east-2.pooler.supabase.com:5432/postgres`

### Want to ping more frequently?
- Edit `.github/workflows/ping-database.yml`
- Change the cron schedule to run more often
- Keep in mind: GitHub Actions free tier has usage limits

## Notes

- The workflow uses your existing Prisma setup, so no additional dependencies are needed
- The ping script creates and deletes a test article entry, ensuring real database activity
- The test article uses a timestamp-based slug to ensure uniqueness
- The workflow also supports manual triggering via the GitHub Actions UI
