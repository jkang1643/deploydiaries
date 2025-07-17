import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/posts'

export async function GET() {
  const posts = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json({ posts })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, author, content } = body

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
        slug
      }
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