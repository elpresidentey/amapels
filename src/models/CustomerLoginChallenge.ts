import mongoose, { Schema } from 'mongoose'

export interface ICustomerLoginChallenge {
  email: string
  name: string
  codeHash: string
  attempts: number
  lastSentAt: Date
  expiresAt: Date
}

const CustomerLoginChallengeSchema = new Schema<ICustomerLoginChallenge>(
  {
    email: { type: String, required: true, lowercase: true },
    name: { type: String, required: true, maxlength: 100 },
    codeHash: { type: String, required: true },
    attempts: { type: Number, required: true, default: 0, min: 0 },
    lastSentAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
  },
  { versionKey: false }
)

CustomerLoginChallengeSchema.index({ email: 1 }, { unique: true })
CustomerLoginChallengeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const CustomerLoginChallenge =
  mongoose.models.CustomerLoginChallenge ||
  mongoose.model<ICustomerLoginChallenge>('CustomerLoginChallenge', CustomerLoginChallengeSchema)

export default CustomerLoginChallenge
