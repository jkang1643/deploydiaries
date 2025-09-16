import { NextResponse } from 'next/server'
import { prisma } from '@/lib/posts'

export async function GET() {
  try {
    // Test database connection by performing a simple query
    const articleCount = await prisma.article.count()
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      articleCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database health check failed:', error)
    return NextResponse.json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 