import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null }

if (!global.mongooseCache) {
  global.mongooseCache = cached
}

async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env')
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5_000,
      connectTimeoutMS: 5_000,
      maxPoolSize: 5,
      minPoolSize: 0,
      maxIdleTimeMS: 10_000,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).catch((error) => {
      cached.promise = null
      cached.conn = null
      throw error
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect
