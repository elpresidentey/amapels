# AMAPELS - Vercel Deployment Guide

## 🚀 Pre-Deployment Checklist

### 1. **Environment Variables Setup**
Create these environment variables in Vercel dashboard:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/amapels-production?retryWrites=true&w=majority

# Paystack Configuration (PRODUCTION KEYS)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_YOUR_LIVE_PUBLIC_KEY
PAYSTACK_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY

# Optional: Supabase (if using for additional features)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Application Configuration
NODE_ENV=production
```

### 2. **Database Setup**
1. **MongoDB Atlas**:
   - Create production cluster
   - Set up proper network access (whitelist Vercel IPs or use 0.0.0.0/0)
   - Create database user with read/write permissions
   - Get connection string

2. **Test Database Connection**:
   ```bash
   npm run validate-system
   ```

### 3. **Payment Integration**
1. **Paystack Live Keys**:
   - Switch from test keys to live keys
   - Verify webhook endpoints if using
   - Test with small amount first

2. **Domain Setup**:
   - Add your domain to Paystack dashboard
   - Configure CORS settings

## 🔧 Deployment Steps

### Step 1: GitHub Repository
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: AMAPELS e-commerce site with mobile fixes"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/amapels.git
git branch -M main
git push -u origin main
```

### Step 2: Vercel Deployment
1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Choose Next.js framework preset

2. **Configure Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add all production environment variables
   - Ensure MONGODB_URI points to production database

3. **Deploy**:
   - Vercel will auto-deploy from main branch
   - Monitor build logs for any issues

### Step 3: Custom Domain Setup
1. **Add Domain in Vercel**:
   - Go to Project Settings → Domains
   - Add your custom domain (e.g., amapels.com)
   
2. **DNS Configuration**:
   ```
   Type: A Record
   Name: @ (or your domain)
   Value: 76.76.19.19 (Vercel IP)
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **SSL Certificate**:
   - Vercel automatically provisions SSL certificates
   - Verify HTTPS is working

## 🧪 Post-Deployment Testing

### 1. **Functional Testing**
```bash
# Test API health
curl https://yourdomain.com/api/health

# Test product endpoints
curl https://yourdomain.com/api/products

# Test system validation
npm run test-checkout
```

### 2. **E2E Testing Checklist**
- [ ] Homepage loads correctly
- [ ] Product catalog displays properly
- [ ] Add to cart functionality works
- [ ] Checkout flow completes successfully
- [ ] Payment processing works with live keys
- [ ] Order confirmation emails sent
- [ ] Admin panel accessible and functional
- [ ] Mobile responsiveness verified

### 3. **Performance Testing**
- [ ] Lighthouse score > 90 for all metrics
- [ ] Core Web Vitals pass
- [ ] Images load properly with optimization
- [ ] Mobile performance acceptable

## 🔒 Security Configuration

### 1. **Environment Security**
```javascript
// next.config.js - Add security headers
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ]
  }
}
```

### 2. **API Security**
- ✅ Rate limiting implemented
- ✅ Input validation on all endpoints
- ✅ Error messages don't expose system details
- ✅ CORS properly configured

## 📊 Monitoring Setup

### 1. **Vercel Analytics**
- Enable Vercel Analytics in project settings
- Monitor Core Web Vitals
- Track user interactions

### 2. **Error Monitoring**
Consider adding Sentry or similar:
```bash
npm install @sentry/nextjs
```

### 3. **Health Monitoring**
Set up monitoring for:
- `/api/health` endpoint
- Payment processing success rates
- Database connection status
- Order completion rates

## 🚨 Emergency Procedures

### 1. **Rollback Process**
```bash
# From Vercel dashboard, redeploy previous successful deployment
# Or revert git commit and redeploy
git revert HEAD
git push origin main
```

### 2. **Database Issues**
- Backup procedures in place
- Fallback to static product data if MongoDB fails
- Contact MongoDB Atlas support

### 3. **Payment Issues**
- Verify Paystack dashboard for service status
- Have backup payment method ready
- Monitor payment success rates

## 📈 Performance Optimization

### 1. **Vercel Configuration**
```javascript
// vercel.json
{
  "images": {
    "domains": ["yourdomain.com"],
    "formats": ["image/webp", "image/avif"]
  },
  "headers": [
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. **Image Optimization**
- Use Next.js Image component with proper sizes
- Compress product images before upload
- Consider using Vercel's image optimization

## 🎯 Launch Preparation

### 1. **Pre-Launch Checklist**
- [ ] All environment variables configured
- [ ] Payment system tested with real transactions
- [ ] Mobile responsiveness verified on actual devices
- [ ] Admin panel fully functional
- [ ] Order management system working
- [ ] Email notifications configured
- [ ] Analytics tracking implemented
- [ ] SEO meta tags optimized
- [ ] Error pages customized

### 2. **Launch Day**
- Deploy during low-traffic hours
- Monitor error rates and performance
- Have team standing by for immediate fixes
- Test critical user flows
- Monitor payment processing

### 3. **Post-Launch**
- Monitor analytics for user behavior
- Track conversion rates
- Gather user feedback
- Plan iterative improvements

## 📞 Support Contacts

### Technical Issues
- Vercel Support: https://vercel.com/help
- MongoDB Atlas: https://support.mongodb.com
- Paystack Support: https://paystack.com/contact

### Emergency Contacts
- Database Admin: [Your DBA contact]
- Payment Processor: [Paystack account manager]
- Domain Registrar: [Your domain provider]

## 🔄 Maintenance Schedule

### Daily
- Monitor error rates and performance
- Check payment processing success

### Weekly  
- Review analytics and user behavior
- Update product inventory if needed
- Check system health metrics

### Monthly
- Update dependencies
- Review security alerts
- Analyze performance trends
- Plan feature improvements

---

**Ready for deployment!** 🎉

Your AMAPELS e-commerce platform is now fully optimized, mobile-responsive, and ready for production deployment on Vercel.