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

    // Perform a lightweight raw query that Supabase counts as activity
    const [{ now }] = await prisma.$queryRaw<Array<{ now: Date }>>`SELECT NOW() AS now`;

    console.log(`✅ Database ping successful! NOW() = ${now.toISOString()}`);
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

