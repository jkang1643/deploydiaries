import { NextRequest, NextResponse } from 'next/server'
import { posts, BlogPost } from '@/lib/posts'

export async function GET() {
  return NextResponse.json({ posts })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, author, content, images, previewImage } = body
    
    if (!title || !author || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, author, content' },
        { status: 400 }
      )
    }
    
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title,
      author,
      date: new Date().toISOString().split('T')[0],
      content,
      excerpt: content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
      images: images || [],
      previewImage: previewImage || null,
      slug
    }
    
    posts.unshift(newPost)
    
    // TEMPORARY MEMORY SAFEGUARD: Limit in-memory posts to 100 for stability.
    // Remove this block when switching to a real database or after testing.
    if (posts.length > 100) posts.pop();
    
    return NextResponse.json({ 
      success: true, 
      id: newPost.id,
      post: newPost 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}