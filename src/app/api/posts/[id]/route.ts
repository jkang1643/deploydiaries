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

export async function GET(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url);
    const id = pathname.split("/").pop();
    const post = await prisma.article.findFirst({
      where: {
        OR: [
          { id: Number.isNaN(Number(id)) ? undefined : Number(id) },
          { slug: id }
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
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Database error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url);
    const id = pathname.split("/").pop();
    const user = await verifyRequestAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const deleted = await prisma.article.delete({
      where: {
        id: Number.isNaN(Number(id)) ? undefined : Number(id),
        ...(Number.isNaN(Number(id)) && { slug: id })
      }
    });
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url);
    const id = pathname.split("/").pop();
    const user = await verifyRequestAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { title, content, author, previewImage } = body;

    // Get the existing article to check if title changed
    const existingArticle = await prisma.article.findFirst({
      where: {
        OR: [
          { id: Number.isNaN(Number(id)) ? undefined : Number(id) },
          { slug: id }
        ]
      }
    });

    if (!existingArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Generate new slug if title changed
    let slug = existingArticle.slug;
    if (title !== existingArticle.title) {
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      // Check if slug exists and generate unique slug
      slug = baseSlug
      let counter = 1
      
      while (true) {
        const slugExists = await prisma.article.findUnique({
          where: { slug }
        })
        
        if (!slugExists || slugExists.id === existingArticle.id) {
          break // Slug is unique or belongs to this article
        }
        
        // Slug exists, try with a number suffix
        slug = `${baseSlug}-${counter}`
        counter++
      }
    }

    const updated = await prisma.article.update({
      where: {
        id: Number.isNaN(Number(id)) ? undefined : Number(id),
        ...(Number.isNaN(Number(id)) && { slug: id })
      },
      data: { 
        title, 
        content, 
        author, 
        slug,
        previewImage: previewImage || null
      }
    });
    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 400 });
  }
}