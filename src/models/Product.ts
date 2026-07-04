import mongoose, { Document, Schema, Model } from 'mongoose'

export interface IProduct extends Document {
  name: string
  price: string
  category: string
  story: string
  material: string
  description: string
  details: string[]
  materials: string
  care: string
  options: string[]
  images: string[]
  featured?: boolean
  createdAt: Date
  updatedAt: Date
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    price: {
      type: String,
      required: [true, 'Please provide a price'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['Earrings', 'Necklaces', 'Bracelets', 'Jewellery Sets'],
    },
    story: {
      type: String,
      required: [true, 'Please provide a product story'],
    },
    material: {
      type: String,
      required: [true, 'Please provide material information'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    details: {
      type: [String],
      required: [true, 'Please provide product details'],
    },
    materials: {
      type: String,
      required: [true, 'Please provide materials information'],
    },
    care: {
      type: String,
      required: [true, 'Please provide care instructions'],
    },
    options: {
      type: [String],
      required: [true, 'Please provide product options'],
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one image'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)

export default Product
