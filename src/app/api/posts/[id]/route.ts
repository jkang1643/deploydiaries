import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/posts'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = await prisma.article.findFirst({
    where: {
      OR: [
        { id: Number.isNaN(Number(params.id)) ? undefined : Number(params.id) },
        { slug: params.id }
      ]
    }
  })

  if (!post) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ post })
}