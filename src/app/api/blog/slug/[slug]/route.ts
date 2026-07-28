import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect()
    const post = await BlogPost.findOne({ slug: params.slug, published: true }).lean()

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({
      post: { ...post, _id: post._id.toString(), id: post._id.toString() },
    })
  } catch (error) {
    console.error('Blog slug fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}