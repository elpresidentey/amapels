# Debug Checkout Error

## Error Analysis: Status Code 400

The `AxiosError` with status code 400 indicates a "Bad Request" from the server. Here are the most likely causes:

## 🔍 **Debugging Steps**

### 1. Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for additional error messages
4. Check Network tab for failed requests

### 2. Check Which API is Failing
The error could be from:
- `/api/verify-payment` - Payment verification
- `/api/orders` - Order creation  
- Paystack API - Payment initialization

### 3. Common 400 Error Causes

#### A. Missing Environment Variables
```
Error: Payment system configuration error
Cause: NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY not set
```

#### B. Database Connection
```
Error: Database connection failed  
Cause: MONGODB_URI not set or invalid
```

#### C. Validation Errors
```
Error: Validation failed
Cause: Order data doesn't match expected schema
```

#### D. Paystack API Issues
```
Error: Invalid payment configuration
Cause: Wrong API keys or malformed request
```

## 🛠️ **Quick Fixes**

### Fix 1: Test Environment Variables Locally
```bash
# In your local .env file, add:
MONGODB_URI=mongodb://localhost:27017/amapels-ng
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_key_here
PAYSTACK_SECRET_KEY=sk_test_your_key_here

# Test locally:
npm run dev
# Try checkout at http://localhost:3001/checkout
```

### Fix 2: Check Vercel Logs
1. Go to: https://vercel.com/dashboard
2. Click your project → Functions tab
3. Look at the error logs for detailed error messages

### Fix 3: Test with Minimal Order
Try checkout with just one item to isolate the issue.

## 📞 **Next Steps**
1. Set up environment variables in Vercel (see vercel-env-setup.md)
2. Check browser console for specific error details
3. Test locally first to confirm the fix
4. Redeploy to Vercel