import mongoose from 'mongoose'

export interface IAdmin {
  email: string
  name: string
  password: string
  role: 'admin' | 'super_admin'
  createdAt: Date
  updatedAt: Date
}

const AdminSchema = new mongoose.Schema<IAdmin>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin',
  },
}, {
  timestamps: true,
})

const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema)

export default Admin