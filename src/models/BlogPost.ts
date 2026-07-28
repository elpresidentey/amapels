import mongoose, { Document, Schema } from 'mongoose'

export interface IBlogPost extends Document {
  title: string
  slug: string
  content: string
  excerpt: string
  author: string
  category: string
  image: string
  tags: string[]
  published: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    author: { type: String, default: 'AMAPELS' },
    category: { type: String, default: 'News' },
    image: { type: String, default: '' },
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
)

BlogPostSchema.pre('save', function () {
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date()
  }
})

const BlogPost =
  mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>('BlogPost', BlogPostSchema)

export default BlogPost