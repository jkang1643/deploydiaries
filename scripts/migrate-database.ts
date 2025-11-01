/**
 * Database Migration Script
 * 
 * This script migrates all data from the old Supabase database to a new one.
 * 
 * Usage:
 * 1. Set OLD_DATABASE_URL in .env.local to your current database
 * 2. Set NEW_DATABASE_URL in .env.local to your new database
 * 3. Run: npx tsx scripts/migrate-database.ts
 */

import dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { PrismaClient } from '@prisma/client';

// Get database URLs from environment
const oldDatabaseUrl = process.env.OLD_DATABASE_URL || process.env.DATABASE_URL;
const newDatabaseUrl = process.env.NEW_DATABASE_URL;

if (!oldDatabaseUrl) {
  throw new Error('OLD_DATABASE_URL or DATABASE_URL must be set');
}

if (!newDatabaseUrl) {
  throw new Error('NEW_DATABASE_URL must be set');
}

// Initialize Prisma clients for both databases
const oldDb = new PrismaClient({
  datasources: {
    db: {
      url: oldDatabaseUrl,
    },
  },
});

const newDb = new PrismaClient({
  datasources: {
    db: {
      url: newDatabaseUrl,
    },
  },
});

async function migrate() {
  try {
    console.log('🚀 Starting database migration...\n');

    // Check connections
    console.log('📡 Checking database connections...');
    await oldDb.$connect();
    console.log('✅ Connected to OLD database');

    await newDb.$connect();
    console.log('✅ Connected to NEW database\n');

    // Ensure the schema exists in the new database
    console.log('📋 Ensuring schema exists in new database...');
    await newDb.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Article" (
        "id" SERIAL NOT NULL,
        "title" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "author" TEXT NOT NULL,
        "previewImage" TEXT,
        CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
      );
    `);

    await newDb.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Article_slug_key" ON "Article"("slug");
    `);
    console.log('✅ Schema verified in new database\n');

    // Fetch all articles from old database
    console.log('📥 Fetching data from OLD database...');
    const articles = await oldDb.article.findMany({
      orderBy: { id: 'asc' },
    });
    console.log(`✅ Found ${articles.length} articles to migrate\n`);

    if (articles.length === 0) {
      console.log('ℹ️  No articles to migrate. Exiting...');
      return;
    }

    // Migrate articles to new database
    console.log('📤 Migrating articles to NEW database...');
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const article of articles) {
      try {
        // Try to create the article
        await newDb.article.create({
          data: {
            id: article.id,
            title: article.title,
            content: article.content,
            slug: article.slug,
            createdAt: article.createdAt,
            author: article.author,
            previewImage: article.previewImage || null,
          },
        });
        successCount++;
        console.log(`  ✓ Migrated: "${article.title}" (ID: ${article.id})`);
      } catch (error: any) {
        // If article already exists (unique constraint), skip it
        if (error.code === 'P2002' || error.message?.includes('unique')) {
          skipCount++;
          console.log(`  ⊘ Skipped (already exists): "${article.title}" (ID: ${article.id})`);
        } else {
          errorCount++;
          console.error(`  ✗ Error migrating "${article.title}" (ID: ${article.id}):`, error.message);
        }
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Migration Summary:');
    console.log('='.repeat(50));
    console.log(`  ✅ Successfully migrated: ${successCount}`);
    console.log(`  ⊘ Skipped (already exists): ${skipCount}`);
    console.log(`  ✗ Errors: ${errorCount}`);
    console.log(`  📝 Total articles processed: ${articles.length}`);
    console.log('='.repeat(50) + '\n');

    if (errorCount > 0) {
      console.log('⚠️  Some articles failed to migrate. Please review the errors above.');
      process.exit(1);
    } else {
      console.log('🎉 Migration completed successfully!');
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await oldDb.$disconnect();
    await newDb.$disconnect();
    console.log('\n🔌 Disconnected from databases');
  }
}

// Run migration
migrate();

