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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await prisma.article.delete({
      where: {
        id: Number.isNaN(Number(params.id)) ? undefined : Number(params.id),
        // fallback to slug if id is not a number
        ...(Number.isNaN(Number(params.id)) && { slug: params.id })
      }
    });
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 400 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, content, author, slug } = body;
    const updated = await prisma.article.update({
      where: {
        id: Number.isNaN(Number(params.id)) ? undefined : Number(params.id),
        ...(Number.isNaN(Number(params.id)) && { slug: params.id })
      },
      data: { title, content, author, slug }
    });
    return NextResponse.json({ success: true, updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update article' }, { status: 400 });
  }
}