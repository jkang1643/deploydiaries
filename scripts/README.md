# Migration Scripts

## Database Migration

Use `scripts/migrate-database.ts` to migrate data from one Supabase database to another.

### Quick Start

1. Add to `.env.local`:
   ```bash
   # Your current database (optional - will use DATABASE_URL if not set)
   OLD_DATABASE_URL="postgresql://..."
   
   # Your new database (required)
   NEW_DATABASE_URL="postgresql://..."
   ```

2. Run the migration:
   ```bash
   npm run migrate:db
   ```

### What Gets Migrated

- All `Article` records with:
  - ID (preserved)
  - Title
  - Content
  - Slug
  - Created timestamp
  - Author
  - Preview image

### Notes

- The script automatically creates the schema in the new database if it doesn't exist
- Duplicate articles (by slug) are automatically skipped
- The script preserves all original IDs and timestamps
- Safe to run multiple times (won't create duplicates)

For detailed instructions, see `MIGRATION_GUIDE.md` in the root directory.

