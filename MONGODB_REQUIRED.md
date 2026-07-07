# ⚠️ MongoDB Configuration Required

## Current Issue
Your Vercel deployment is returning **503 errors** when creating orders because MongoDB is not configured.

## What's Happening
- **Payment succeeds** ✅ (Paystack works fine)
- **Order creation fails** ❌ (MongoDB connection not available)
- **No order confirmation** ❌ (redirect never happens)

## Quick Fix (Choose One)

### Option 1: MongoDB Atlas (Recommended - Free)
See detailed instructions in `docs/mongodb-setup.md`

**Quick Steps:**
1. Create free MongoDB Atlas account: https://www.mongodb.com/cloud/atlas/register
2. Create a cluster (M0 free tier)
3. Get connection string
4. Add to Vercel:
   ```bash
   vercel env add MONGODB_URI production
   # Paste your connection string when prompted
   ```
5. Redeploy:
   ```bash
   vercel --prod
   ```

### Option 2: Use Vercel's MongoDB Integration
1. Go to your Vercel project dashboard
2. Click **Storage** → **Create Database**
3. Select **MongoDB** (they partner with Atlas)
4. Follow the wizard (auto-configures everything)

### Option 3: Alternative - Supabase Postgres (If you prefer)
Since you already have Supabase configured, you could:
1. Switch from MongoDB to Supabase Postgres
2. Update the schema and queries
3. This would require code changes but unifies your stack

## Why Not Working Now
Your `.env` file has:
```env
MONGODB_URI=mongodb://localhost:27017/amapels-ng
```

This **only works on your local machine**. Vercel can't connect to `localhost`.

## After Setup
Once MongoDB is configured:
1. Orders will save successfully
2. Order confirmation page will show
3. Admin can view orders at `/admin/orders`
4. Email notifications can be sent (future feature)

## Current Workaround (Testing Only)
For testing the order confirmation page directly:
```
https://amapels.vercel.app/order-confirmation?ref=TEST-123
```

But this won't have real order data without MongoDB.
