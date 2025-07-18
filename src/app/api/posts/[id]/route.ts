import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/posts'
import { adminAuth } from '@/lib/firebaseAdmin'

async function verifyRequestAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const idToken = authHeader.split(' ')[1];
  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    if (decoded.email === 'jkang1643@gmail.com') {
      return decoded;
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
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
  context: { params: { id: string } }
) {
  const { params } = context;
  const user = await verifyRequestAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const deleted = await prisma.article.delete({
      where: {
        id: Number.isNaN(Number(params.id)) ? undefined : Number(params.id),
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
  context: { params: { id: string } }
) {
  const { params } = context;
  const user = await verifyRequestAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
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