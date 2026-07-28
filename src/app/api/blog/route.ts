import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'
import { requireAdmin } from '@/lib/admin-guard'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1)
    const skip = (page - 1) * limit
    const includeUnpublished = searchParams.get('all') === 'true'

    const filter: Record<string, any> = {}
    if (!includeUnpublished) filter.published = true
    if (category) filter.category = category

    const [posts, total] = await Promise.all([
      BlogPost.find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments(filter),
    ])

    return NextResponse.json({
      posts: posts.map((p: any) => ({
        ...p,
        _id: p._id.toString(),
        id: p._id.toString(),
      })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('Blog fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request)
  if (authError) return authError

  try {
    const data = await request.json()
    await dbConnect()

    if (!data.title || !data.content || !data.slug) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      )
    }

    const existing = await BlogPost.findOne({ slug: data.slug })
    if (existing) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 })
    }

    const post = await BlogPost.create({
      title: data.title.trim(),
      slug: data.slug.trim().toLowerCase().replace(/\s+/g, '-'),
      content: data.content,
      excerpt: data.excerpt?.trim() || data.content.slice(0, 200),
      author: data.author?.trim() || 'AMAPELS',
      category: data.category?.trim() || 'News',
      image: data.image || '',
      tags: data.tags || [],
      published: data.published ?? true,
      publishedAt: data.published ? new Date() : undefined,
    })

    return NextResponse.json(
      { post: { ...post.toObject(), _id: post._id.toString(), id: post._id.toString() } },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Blog create error:', error)
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Duplicate slug' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}