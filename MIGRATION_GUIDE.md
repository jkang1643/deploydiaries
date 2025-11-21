# Database Migration Guide

This guide will help you migrate all data from your current Supabase database to a new Supabase database.

## Prerequisites

1. Access to both your **old** and **new** Supabase projects
2. Database connection strings for both databases
3. Node.js and npm installed
4. All dependencies installed (`npm install`)

## Step 1: Get Your Database Connection Strings

### Old Database (Current)
Your current database URL is already in `.env.local` as `DATABASE_URL`. You can also get it from:
- Supabase Dashboard → Settings → Database → Connection string (URI mode)

### New Database
1. Go to your new Supabase project dashboard
2. Navigate to Settings → Database
3. Copy the Connection string (URI mode)
4. It should look like: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres`

## Step 2: Set Up Environment Variables

Add the following to your `.env.local` file:

```bash
# Old database (current - can also use existing DATABASE_URL)
OLD_DATABASE_URL="postgresql://postgres.npwrxwwjwixnmfibhzpt:Jesus*=1hamelech@aws-0-us-east-2.pooler.supabase.com:5432/postgres"

# New database (replace with your new database URL)
NEW_DATABASE_URL="postgresql://postgres.[your-new-project-ref]:[your-password]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

**Important:** 
- Keep your existing `DATABASE_URL` as a backup (it will be used if `OLD_DATABASE_URL` is not set)
- Make sure to use the **pooler** connection string (not the direct connection) for better reliability

## Step 3: Set Up Schema in New Database

Before migrating data, you need to ensure your new database has the same schema. You have two options:

### Option A: Use Prisma Migrate (Recommended)

1. Temporarily update your `.env.local` to point to the new database:
   ```bash
   DATABASE_URL="your-new-database-url"
   ```

2. Run Prisma migrations:
   ```bash
   npx prisma migrate deploy
   ```

3. **Important:** Restore your original `DATABASE_URL` or keep both `OLD_DATABASE_URL` and `NEW_DATABASE_URL` set.

### Option B: The Script Handles It Automatically

The migration script will automatically create the schema if it doesn't exist. However, using Prisma Migrate (Option A) is recommended for consistency.

## Step 4: Run the Migration Script

Run the migration script:

```bash
npm run migrate:db
```

Or directly:

```bash
npx tsx scripts/migrate-database.ts
```

## What the Script Does

1. ✅ Connects to both old and new databases
2. ✅ Verifies the schema exists in the new database (creates it if missing)
3. ✅ Fetches all articles from the old database
4. ✅ Migrates each article to the new database
5. ✅ Preserves all data including IDs, timestamps, and relationships
6. ✅ Skips articles that already exist (prevents duplicates)
7. ✅ Provides a detailed summary of the migration

## Step 5: Verify the Migration

After the migration completes:

1. Check the summary output to see how many articles were migrated
2. Optionally, connect to your new database and verify:
   ```bash
   # Temporarily set DATABASE_URL to new database
   DATABASE_URL="your-new-database-url" npx prisma studio
   ```

## Step 6: Update Your Application ⚠️ **CRITICAL STEP**

Once migration is complete and verified:

1. **Update your `.env.local` to use the new database:**
   ```bash
   DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.[your-new-project-ref].supabase.co:5432/postgres"
   ```
   Replace `[YOUR_PASSWORD]` with your actual database password and `[your-new-project-ref]` with your new project reference.

2. **Restart your development server:**
   ```bash
   # Stop your current dev server (Ctrl+C)
   # Then restart it:
   npm run dev
   ```
   ⚠️ **Important:** Environment variables are only loaded when the server starts. You MUST restart your dev server after changing `DATABASE_URL`.

3. **Update your production environment variables (Vercel, etc.) with the new `DATABASE_URL`** ⚠️ **REQUIRED FOR PRODUCTION**
   
   **Current (OLD) database in Vercel:**
   ```
   postgresql://postgres.npwrxwwjwixnmfibhzpt:Jesus*=1hamelech@aws-0-us-east-2.pooler.supabase.com:5432/postgres
   ```
   (Contains `npwrxwwjwixnmfibhzpt` - this is the OLD database)
   
   **New database URL to set in Vercel:**
   ```
   postgresql://postgres:Jesus*=1hamelech@db.buexhyqkvhtbsroebecm.supabase.co:5432/postgres
   ```
   (Contains `buexhyqkvhtbsroebecm` - this is the NEW database)
   
   **Steps:**
   - Go to your Vercel project dashboard
   - Navigate to **Settings → Environment Variables**
   - Find the `DATABASE_URL` variable
   - Click **Edit** and replace it with the new database URL above
   - Make sure to select the correct environments (Production, Preview, Development)
   - **Save** the changes
   - **Redeploy** your application (or wait for the next deployment)
   
   ⚠️ **Important:** Your production app will continue using the old database until you update this in Vercel!

4. **Test your application to ensure everything works correctly**
   - Check that your articles are loading from the new database
   - Verify that new articles are being saved to the new database

## Troubleshooting

### App is still using the old database after migration
- **Most common issue:** You need to restart your development server after updating `DATABASE_URL`
  - Stop your dev server (Ctrl+C)
  - Restart with `npm run dev`
- Check that `DATABASE_URL` in `.env.local` points to the new database (should contain `buexhyqkvhtbsroebecm` for the new one)
- If using Vercel, make sure you've updated the `DATABASE_URL` environment variable in Vercel project settings and redeployed
- Verify the connection string format matches what Supabase provides

### Error: "NEW_DATABASE_URL environment variable is not set"
- Make sure you've added `NEW_DATABASE_URL` to your `.env.local` file
- Restart your terminal/IDE to reload environment variables

### Error: Connection timeout or refused
- Verify your database connection strings are correct
- Check that your Supabase project is active (not paused)
- Ensure your IP is allowed (Supabase allows all by default, but check if you have restrictions)

### Error: Schema mismatch
- Run Prisma migrations on the new database first (Step 3, Option A)
- Or let the script create the schema automatically (Step 3, Option B)

### Articles already exist (duplicate key errors)
- This is normal if you run the script multiple times
- The script will skip existing articles automatically
- To re-migrate, you'll need to clear the new database first

### Some articles failed to migrate
- Check the error messages in the console output
- Common issues:
  - Invalid data that violates constraints
  - Network issues during migration
  - Database connection limits

## Safety Tips

1. **Backup First**: Always backup your old database before migration (Supabase provides automatic backups)
2. **Test First**: Consider testing the migration with a small subset of data first
3. **Keep Old Database**: Don't delete your old database until you've verified everything works
4. **Monitor**: Watch the migration progress for any errors

## Alternative: Using Supabase Dashboard

If you prefer a UI-based approach, you can also use Supabase's built-in export/import features:

1. Go to your old Supabase project
2. Navigate to Database → Backups
3. Export your data as SQL dump
4. Go to your new Supabase project
5. Run the SQL dump in the SQL Editor

However, the provided script is more reliable and handles edge cases better.

## Need Help?

If you encounter issues:
1. Check the console output for specific error messages
2. Verify all environment variables are set correctly
3. Ensure both databases are accessible
4. Review the Supabase logs in both projects

