import { NextRequest, NextResponse } from 'next/server'
import { posts } from '@/lib/posts'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = posts.find(p => p.id === params.id || p.slug === params.id)
  
  if (!post) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json({ post })
}