# 🚀 AMAPELS Setup Instructions

## ⚡ Quick Setup (5 Minutes)

Your site is **LIVE** at: **https://amapels.vercel.app**

But to enable **image uploads**, you need to run ONE SQL script:

---

## 📝 ONE-TIME SETUP REQUIRED

### Run This SQL Script:

1. Open: https://supabase.com/dashboard
2. Select your AMAPELS project
3. Click **SQL Editor** (left menu)
4. Open the file: `supabase-storage-setup.sql`
5. Copy ALL the contents
6. Paste into Supabase SQL Editor
7. Click **Run** (or press Ctrl+Enter)
8. You should see: ✅ "Storage bucket setup completed successfully!"

**That's it!** Image uploads are now enabled.

---

## ✅ What's Working Right Now

### Live Features:
- ✅ Website is deployed and live
- ✅ All 24 products are visible on shop page
- ✅ Shopping cart works
- ✅ Checkout with Paystack payment
- ✅ Admin panel (login: `admin@amapels.com` / `Amapels2024!`)
- ✅ Order management
- ✅ Product management

### What Needs Setup:
- ⚠️ **Image upload** - Needs SQL script (5 min)
- ✅ Everything else is ready!

---

## 🎯 Test Image Upload

After running the SQL script:

1. Go to: https://amapels.vercel.app/admin/login
2. Login: `admin@amapels.com` / `Amapels2024!`
3. Click **Products** → **Add Product**
4. Scroll to "Product Images"
5. Click the upload box or drag an image
6. See preview appear instantly! ✨

---

## 📋 Current Product Catalog

**24 Beautiful Jewelry Products:**

### Earrings (6):
1. AMAPELS Signature Hoop
2. Golden Pearl Drop Earrings
3. Classic Stud Earrings
4. Statement Hoop Earrings
5. Dangle Pearl Earrings
6. Modern Drop Earrings

### Necklaces (6):
7. Elegant Chain Necklace
8. Gold Pendant Necklace
9. Statement Choker Necklace
10. Layered Chain Necklace
11. Delicate Gold Necklace
12. Bold Chain Necklace

### Bracelets (6):
13. Gold Bangle Bracelet
14. Chain Link Bracelet
15. Elegant Cuff Bracelet
16. Beaded Bracelet
17. Delicate Chain Bracelet
18. Crystal Halo Bracelet

### Jewellery Sets (6):
19. Bridal Jewellery Set
20. Evening Glamour Set
21. Classic Gold Set
22. Statement Set
23. Pearl Collection Set
24. Modern Elegance Set

All products use high-quality images from your `/public/images` folder!

---

## 🔐 Admin Access

**Login URL:** https://amapels.vercel.app/admin/login

**Credentials:**
- Email: `admin@amapels.com`
- Password: `Amapels2024!`

**Admin Features:**
- View dashboard with sales overview
- Manage products (add, edit, delete, feature)
- View and manage orders
- Track sales analytics
- Upload product images (after SQL setup)

---

## 💳 Payment Setup

**Paystack is configured!**

Test Mode Keys (already in Vercel):
- Public Key: `pk_test_fa6746bb37adf4c948f664f6c5f828232212ca8e`
- Secret Key: `sk_test_2123289e6435a7fd496da2597503940b8c38d3b1`

**To go live:**
1. Get production keys from Paystack dashboard
2. Update in Vercel → Settings → Environment Variables
3. Redeploy

---

## 🎨 Design

**Color Scheme:**
- Primary: White (#FFFFFF)
- Brand: Black (#000000)
- Accent: Gold (#D4AF37)

**Mobile Responsive:**
- ✅ All pages optimized for mobile
- ✅ Cards display beautifully on all devices
- ✅ Touch-friendly buttons and forms

---

## 📦 Environment Variables (Vercel)

These are **ALREADY SET** in Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_SECRET_KEY=sk_test_...
```

**Optional (for better security):**
```env
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

---

## 🗄️ Database (Supabase)

**Current Setup:**
- ✅ Products table created
- ✅ Orders table created
- ✅ Policies configured
- ⚠️ Storage bucket needs setup (run SQL script)

**Sample Data:**
- The 24 products come from `fallbackProducts.ts`
- They'll be used if Supabase has no products yet
- You can add real products via admin panel

---

## 📖 Documentation Files

- `IMAGE_UPLOAD_SETUP.md` - Quick start for image uploads
- `docs/image-upload-setup.md` - Full documentation
- `docs/deploy-checklist.md` - Deployment guide
- `docs/mongodb-setup.md` - Old MongoDB docs (not needed)
- `supabase-storage-setup.sql` - **RUN THIS!**
- `supabase-migration.sql` - Database setup (already done)

---

## 🐛 Common Issues

### Products not showing?
→ Check `/shop` page - all 24 should be visible now!

### Can't upload images?
→ Run `supabase-storage-setup.sql` in Supabase

### Admin login not working?
→ Use: `admin@amapels.com` / `Amapels2024!`

### Orders not saving?
→ Check Supabase connection in environment variables

---

## 📞 Support Commands

### Local Development:
```bash
npm run dev          # Start dev server
npm run build        # Test production build
npm run lint         # Check code quality
```

### Git Commands:
```bash
git status           # Check changes
git add .            # Stage changes
git commit -m "msg"  # Commit changes
git push origin main # Push to GitHub
```

### Deployment:
```bash
vercel --prod        # Deploy to production
```

---

## ✨ What's New

### Latest Update (Image Upload Feature):
- ✅ Drag & drop image upload
- ✅ Multiple image support (up to 5 per product)
- ✅ File validation (type and size)
- ✅ Instant preview
- ✅ Stored in Supabase Storage
- ✅ Fallback to manual URL entry

---

## 🎯 Next Steps for You

### Immediate (5 min):
1. Run `supabase-storage-setup.sql` in Supabase
2. Test image upload in admin panel
3. Verify images display on shop page

### Soon:
1. Add real products via admin panel
2. Test complete purchase flow
3. Switch to Paystack live keys
4. Customize content (About, Story, etc.)

### Later:
1. Monitor orders in admin panel
2. Track sales analytics
3. Update product inventory
4. Add promotional banners

---

## 📊 Site Status

- **Frontend:** ✅ Deployed on Vercel
- **Database:** ✅ Supabase connected
- **Storage:** ⚠️ Needs SQL script
- **Payment:** ✅ Paystack configured (test mode)
- **Products:** ✅ 24 items visible
- **Admin:** ✅ Fully functional
- **Mobile:** ✅ Responsive design

---

## 🎉 You're Almost Done!

Just **one SQL script** away from having a fully functional e-commerce site with admin panel and image uploads!

**Remember:**
1. Run `supabase-storage-setup.sql` in Supabase SQL Editor
2. Test image upload in admin panel
3. You're ready to sell! 🚀

---

**Need Help?**
- Check browser console (F12) for errors
- Review Supabase logs in dashboard
- All documentation is in the `docs/` folder

**Your Site:** https://amapels.vercel.app
**Admin Panel:** https://amapels.vercel.app/admin
