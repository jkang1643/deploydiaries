/**
 * Database Ping Script
 * 
 * This script pings the database to keep it active and prevent Supabase from pausing it.
 * It performs a simple query to ensure the database remains active.
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
    
    // Perform a simple query to keep the database active
    // This counts articles, which is a lightweight operation
    const articleCount = await prisma.article.count();
    
    console.log(`✅ Database ping successful! Found ${articleCount} articles.`);
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);
    
    return { success: true, articleCount };
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

