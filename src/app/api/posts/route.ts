import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/posts'

export async function GET() {
  try {
    const posts = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        author: true,
        content: true,
        slug: true,
        createdAt: true,
        previewImage: true,
      },
    });
    return NextResponse.json({ posts });
  } catch {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ posts: [], error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, author, content, previewImage } = body

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

    const newPost = await prisma.article.create({
      data: {
        title,
        author,
        content,
        slug,
        previewImage: previewImage || null,
      },
      select: {
        id: true,
        title: true,
        author: true,
        content: true,
        slug: true,
        createdAt: true,
        previewImage: true,
      },
    })

    return NextResponse.json({
      success: true,
      id: newPost.id,
      post: newPost
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body or database error' },
      { status: 400 }
    )
  }
}