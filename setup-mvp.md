# AMAPELS MVP Setup Guide

This guide will help you set up the minimum viable product (MVP) for the AMAPELS e-commerce checkout system.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (local installation or MongoDB Atlas account)
3. **Paystack Account** (for payment processing)

## Step 1: Environment Configuration

1. Copy the environment variables:
   ```bash
   copy .env.example .env
   ```

2. Configure your `.env` file with the following:

### MongoDB Configuration
- **Local MongoDB**: Use `mongodb://localhost:27017/amapels-ng`
- **MongoDB Atlas**: Get your connection string from Atlas dashboard

### Paystack Configuration
1. Sign up at [Paystack](https://paystack.com) if you haven't already
2. Go to Settings > API Keys & Webhooks
3. Copy your **Test** keys (for development):
   - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - `PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Database Setup

### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The database will be created automatically when the first order is placed

### Option B: MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace the MONGODB_URI in your .env file

## Step 4: Start the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Step 5: Test the Checkout

1. Navigate to the shop page: `http://localhost:3000/shop`
2. Add items to cart
3. Go to checkout: `http://localhost:3000/checkout`
4. Fill in the delivery information
5. Complete the payment using Paystack test cards:
   - **Test Card**: 4084 0840 8408 4081
   - **CVV**: Any 3 digits
   - **Expiry**: Any future date
   - **OTP**: 123456

## Verification

After completing a test order:
1. Check your MongoDB database for the new order
2. Verify the payment in your Paystack dashboard
3. Check the order confirmation page

## Troubleshooting

### Common Issues:

1. **Payment Gateway Not Loading**
   - Check if NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is set correctly
   - Ensure no ad blockers are interfering

2. **Database Connection Errors**
   - Verify MONGODB_URI is correct
   - Check if MongoDB service is running (for local setup)
   - Verify network access for Atlas

3. **Order Creation Fails**
   - Check browser console for errors
   - Verify all required fields are filled
   - Check server logs in terminal

### Environment Variables Checklist:
- [ ] MONGODB_URI is set and accessible
- [ ] NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is set (starts with pk_test_)
- [ ] PAYSTACK_SECRET_KEY is set (starts with sk_test_)

## Next Steps for Production

1. Switch to Paystack live keys
2. Set up production MongoDB cluster
3. Configure proper error monitoring
4. Set up email notifications for orders
5. Implement order management dashboard

## Support

If you encounter any issues:
1. Check the browser console for JavaScript errors
2. Check the terminal/server logs for backend errors
3. Verify all environment variables are set correctly
4. Test with Paystack's test cards first