# Vercel Environment Variables Setup

## Quick Fix for Checkout Error

The checkout error is likely due to missing environment variables in Vercel. Here's how to fix it:

### 1. Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Find your "amapels" project
3. Click on the project name

### 2. Add Environment Variables
1. Click "Settings" tab
2. Click "Environment Variables" in the sidebar
3. Add these variables:

#### Required Variables:
```
Name: MONGODB_URI
Value: mongodb+srv://your-username:your-password@cluster.mongodb.net/amapels-ng?retryWrites=true&w=majority

Name: NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY  
Value: pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Name: PAYSTACK_SECRET_KEY
Value: sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Environment Selection
- For testing: Use "Preview" and "Development" environments
- For production: Use "Production" environment
- Recommended: Add to ALL environments initially

### 4. Redeploy After Adding Variables
After adding the environment variables:
1. Go to "Deployments" tab
2. Find the latest deployment
3. Click the three dots menu
4. Click "Redeploy"

OR run: `vercel --prod` again

## Quick Test Setup

### For Testing (Recommended First):
Use Paystack TEST keys:
- Public Key: pk_test_xxxxx (from your Paystack dashboard)
- Secret Key: sk_test_xxxxx (from your Paystack dashboard)

### For Production:
Use Paystack LIVE keys:  
- Public Key: pk_live_xxxxx
- Secret Key: sk_live_xxxxx

## Database Options

### Option 1: MongoDB Atlas (Recommended)
1. Create free account: https://www.mongodb.com/atlas
2. Create cluster
3. Get connection string
4. Replace username/password in the URI

### Option 2: Local MongoDB (Development Only)  
```
MONGODB_URI=mongodb://localhost:27017/amapels-ng
```

## After Setup
1. Visit: https://amapels.vercel.app/checkout
2. Add items to cart first: https://amapels.vercel.app/shop
3. Test checkout with Paystack test card: 4084 0840 8408 4081