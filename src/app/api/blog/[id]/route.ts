import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'
import { requireAdmin } from '@/lib/admin-guard'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const post = await BlogPost.findById(params.id).lean()
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    return NextResponse.json({
      post: { ...post, _id: post._id.toString(), id: post._id.toString() },
    })
  } catch (error) {
    console.error('Blog fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAdmin(request)
  if (authError) return authError

  try {
    const data = await request.json()
    await dbConnect()

    const update: Record<string, any> = {}
    if (data.title !== undefined) update.title = data.title.trim()
    if (data.content !== undefined) update.content = data.content
    if (data.excerpt !== undefined) update.excerpt = data.excerpt.trim()
    if (data.author !== undefined) update.author = data.author.trim()
    if (data.category !== undefined) update.category = data.category.trim()
    if (data.image !== undefined) update.image = data.image
    if (data.tags !== undefined) update.tags = data.tags
    if (data.published !== undefined) {
      update.published = data.published
      if (data.published && !data.publishedAt) {
        update.publishedAt = new Date()
      }
    }

    if (data.slug !== undefined) {
      update.slug = data.slug.trim().toLowerCase().replace(/\s+/g, '-')
      const existing = await BlogPost.findOne({
        slug: update.slug,
        _id: { $ne: params.id },
      })
      if (existing) {
        return NextResponse.json({ error: 'Slug already in use' }, { status: 409 })
      }
    }

    const post = await BlogPost.findByIdAndUpdate(params.id, { $set: update }, { new: true })
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({
      post: { ...post.toObject(), _id: post._id.toString(), id: post._id.toString() },
    })
  } catch (error) {
    console.error('Blog update error:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAdmin(request)
  if (authError) return authError

  try {
    await dbConnect()
    const post = await BlogPost.findByIdAndDelete(params.id)
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Blog delete error:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}