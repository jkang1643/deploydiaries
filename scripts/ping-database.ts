/**
 * Database Ping Script
 * 
 * This script pings the database to keep it active and prevent Supabase from pausing it.
 * It creates a test article entry and then deletes it to ensure database activity.
 * 
 * Usage: npx tsx scripts/ping-database.ts
 */

import dotenv from 'dotenv';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';

// Load .env.local file if it exists (for local testing)
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function pingDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Pinging database...');

    // Generate a unique slug with timestamp to ensure uniqueness
    const timestamp = Date.now();
    const slug = `ping-${timestamp}`;

    // Create article entry
    console.log('📝 Creating test article...');
    const article = await prisma.article.create({
      data: {
        title: 'ping',
        author: 'joseph kang',
        content: 'test',
        slug: slug,
      },
    });

    console.log(`✅ Article created successfully!`);
    console.log(`   ID: ${article.id}`);
    console.log(`   Title: ${article.title}`);
    console.log(`   Author: ${article.author}`);
    console.log(`   Slug: ${article.slug}`);

    // Delete the article immediately
    console.log('🗑️  Deleting test article...');
    await prisma.article.delete({
      where: { id: article.id },
    });

    console.log(`✅ Article deleted successfully!`);
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);

    return { success: true };
  } catch (error) {
    console.error('❌ Database ping failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the ping
pingDatabase()
  .then((result) => {
    console.log('✨ Ping completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Ping failed:', error);
    process.exit(1);
  });

