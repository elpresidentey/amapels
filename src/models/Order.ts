import mongoose from 'mongoose'

export interface IOrderItem {
  productId: string // Changed from ObjectId to string to match checkout data
  name: string
  price: number
  quantity: number
  image: string
}

export interface IOrder {
  orderNumber?: string
  customerEmail: string
  customerName: string
  customerPhone?: string
  items: IOrderItem[]
  shippingAddress: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  billingAddress?: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  subtotal: number
  shippingCost?: number
  tax?: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentReference?: string
  trackingNumber?: string
  estimatedDelivery?: string
  metadata?: Record<string, any>
  notes?: string
  createdAt?: Date
  updatedAt?: Date
}

const OrderItemSchema = new mongoose.Schema<IOrderItem>({
  productId: {
    type: String, // Changed from ObjectId to String
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
    required: true,
  },
})

const AddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: 'Nigeria' },
})

const OrderSchema = new mongoose.Schema<IOrder>({
  orderNumber: {
    type: String,
    unique: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
  },
  items: [OrderItemSchema],
  shippingAddress: {
    type: AddressSchema,
    required: true,
  },
  billingAddress: AddressSchema,
  subtotal: {
    type: Number,
    required: true,
  },
  shippingCost: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentReference: {
    type: String,
  },
  trackingNumber: {
    type: String,
  },
  estimatedDelivery: {
    type: String,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
})

OrderSchema.pre('save', function() {
  if (!this.orderNumber) {
    this.orderNumber = `AMP${new Date().getFullYear()}${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`
  }
  if (!this.trackingNumber) {
    this.trackingNumber = `TRK-${Date.now().toString().slice(-8)}`
  }
})

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)

export default Order