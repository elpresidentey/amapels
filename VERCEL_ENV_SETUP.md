# Vercel Environment Variables Setup

## 🔑 Your Paystack Keys (Test Mode)
```
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_fa6746bb37adf4c948f664f6c5f828232212ca8e
PAYSTACK_SECRET_KEY=sk_test_2123289e6435a7fd496da2597503940b8c38d3b1
```

## 🗄️ MongoDB Database Options

### Option 1: MongoDB Atlas (Recommended - Free)
1. Go to: https://www.mongodb.com/atlas
2. Create free account
3. Create new cluster (M0 Sandbox - Free)
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/amapels-ng`

### Option 2: Quick Test Database (Temporary)
For immediate testing, you can use a demo connection:
```
MONGODB_URI=mongodb+srv://demo:demo123@cluster0.mongodb.net/amapels-demo?retryWrites=true&w=majority
```

## 📋 Steps to Add to Vercel

### Method 1: Vercel Dashboard (Recommended)
1. Go to: https://vercel.com/dashboard
2. Find your "amapels" project
3. Click project name
4. Go to "Settings" tab
5. Click "Environment Variables"
6. Add these 3 variables:

```
Name: MONGODB_URI
Value: [Your MongoDB connection string]
Environment: Production, Preview, Development

Name: NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
Value: pk_test_fa6746bb37adf4c948f664f6c5f828232212ca8e
Environment: Production, Preview, Development

Name: PAYSTACK_SECRET_KEY
Value: sk_test_2123289e6435a7fd496da2597503940b8c38d3b1
Environment: Production, Preview, Development
```

### Method 2: Command Line (Alternative)
```bash
vercel env add MONGODB_URI
vercel env add NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
vercel env add PAYSTACK_SECRET_KEY
```

## 🚀 After Adding Variables
Run deployment:
```bash
vercel --prod
```

## 🧪 Test the Checkout
1. Visit: https://amapels.vercel.app/shop
2. Add items to cart
3. Go to checkout
4. Use Paystack test card: **4084 0840 8408 4081**
5. CVV: **123**, Expiry: **12/25**, OTP: **123456**