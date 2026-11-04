import mongoose, { Schema } from 'mongoose'

export interface IApiRateLimit {
  key: string
  count: number
  expiresAt: Date
}

const ApiRateLimitSchema = new Schema<IApiRateLimit>(
  {
    key: { type: String, required: true },
    count: { type: Number, required: true, default: 0, min: 0 },
    expiresAt: { type: Date, required: true },
  },
  { versionKey: false }
)

ApiRateLimitSchema.index({ key: 1 }, { unique: true })
ApiRateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const ApiRateLimit =
  mongoose.models.ApiRateLimit || mongoose.model<IApiRateLimit>('ApiRateLimit', ApiRateLimitSchema)

export default ApiRateLimit
