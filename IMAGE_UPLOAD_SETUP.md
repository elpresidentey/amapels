# 🎯 Image Upload Setup - Quick Start

## ✅ What's Been Added

1. **ImageUpload Component** - Drag & drop image uploader with preview
2. **Upload API** - `/api/upload-image` endpoint for handling file uploads
3. **Supabase Storage** - Cloud storage for product images
4. **Updated Admin Panel** - Products page now has visual image upload

## 🚀 Setup Steps (5 minutes)

### Step 1: Run SQL Script in Supabase

1. Open your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Copy and paste the contents of `supabase-storage-setup.sql`
5. Click **Run** or press `Ctrl+Enter`
6. You should see: "Storage bucket setup completed successfully!"

### Step 2: Add Environment Variable (Optional but Recommended)

Open your `.env.local` file and add:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Where to find it:**
- Supabase Dashboard → Settings → API
- Look for "service_role" key (starts with `eyJ...`)

### Step 3: Verify Setup

1. Go to Supabase Dashboard → Storage
2. You should see a bucket named `product-images`
3. Check that it's marked as "Public"

### Step 4: Test Upload

1. Start your dev server: `npm run dev`
2. Go to: http://localhost:3000/admin/login
3. Login with admin credentials
4. Go to Products → Add Product
5. Try uploading an image from your device
6. You should see a preview appear

## ✨ How It Works

### For Admin Users

1. **Upload from Device:**
   - Click the upload box or drag images
   - Select up to 5 images
   - Each image max 5MB
   - Supports: JPG, PNG, WEBP, GIF

2. **Remove Images:**
   - Hover over thumbnail
   - Click red X button

3. **Add URL Manually:**
   - Click "Or add image URL manually"
   - Enter URL from `/public/images` or external source

### Behind the Scenes

```
User selects image
     ↓
Validates type & size
     ↓
Uploads to /api/upload-image
     ↓
Stored in Supabase Storage
     ↓
Returns public URL
     ↓
Saved to product in database
```

## 🔧 Environment Variables Needed

### Local (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx... (optional)
```

### Vercel (Production)

Add these in Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (optional)

## 📦 Files Created/Modified

### New Files:
- ✅ `src/components/ImageUpload.tsx` - Upload component
- ✅ `src/app/api/upload-image/route.ts` - Upload API
- ✅ `supabase-storage-setup.sql` - Storage bucket setup
- ✅ `docs/image-upload-setup.md` - Detailed documentation
- ✅ This file - Quick start guide

### Modified Files:
- ✅ `src/app/admin/products/page.tsx` - Uses new ImageUpload component
- ✅ `.env.example` - Updated with Supabase variables

## 🎨 Features

- **Drag & Drop:** Drag images directly onto upload box
- **Multiple Upload:** Select multiple images at once
- **Visual Preview:** See thumbnails immediately
- **Error Handling:** Clear error messages for invalid files
- **Mobile Friendly:** Works on all devices
- **Fallback Option:** Can still add URLs manually

## 🐛 Troubleshooting

### "Supabase not configured" error
→ Check environment variables are set and restart dev server

### "Policy violation" error
→ Run the `supabase-storage-setup.sql` script in Supabase

### Upload succeeds but image doesn't display
→ Check bucket is set to "Public" in Supabase Dashboard

### "File too large" error
→ Compress image or ensure it's under 5MB

## 🎯 Next Steps

1. ✅ Run SQL script in Supabase
2. ✅ Add service role key to .env.local
3. ✅ Test upload locally
4. ✅ Add environment variables to Vercel
5. ✅ Deploy to production
6. ✅ Test in production

## 📚 More Info

See `docs/image-upload-setup.md` for complete documentation.

---

**Need Help?** Check:
1. Browser console for JavaScript errors
2. Supabase Dashboard → Logs for backend errors
3. Network tab to see upload requests
