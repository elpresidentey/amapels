# 🚀 Enable Image Upload - Quick Guide

## ⚡ 3-Minute Setup

Image upload is **ready to use** but needs a **one-time setup** in Supabase.

---

## 📝 Step-by-Step Instructions

### Step 1: Open Supabase Dashboard
1. Go to: **https://supabase.com/dashboard**
2. **Sign in** to your account
3. **Select** your AMAPELS project

### Step 2: Open SQL Editor
1. Look at the **left sidebar**
2. Click on **"SQL Editor"** (icon looks like a document with code)
3. A new page will open

### Step 3: Run the SQL Script
1. Click **"New query"** button (top right)
2. **Copy ALL** the text from `supabase-storage-setup.sql` file
3. **Paste** into the SQL editor
4. Click **"Run"** button (or press Ctrl+Enter)

### Step 4: Verify Success
You should see messages like:
```
✅ Storage bucket setup completed successfully!
✅ Bucket: product-images
✅ Public access: enabled
✅ Max file size: 5MB
```

### Step 5: Verify Bucket Created
1. Click **"Storage"** in left sidebar
2. You should see **"product-images"** bucket
3. It should show **"Public"** badge

---

## ✅ Done!

Image upload is now working! Go test it:

1. Login to admin: https://amapels.vercel.app/admin/login
2. Go to **Products** → **Add Product**
3. Try **dragging an image** into the upload box
4. You should see a **preview** appear instantly!

---

## 🎯 What This Script Does

### Creates Storage Bucket
- Name: `product-images`
- Type: Public (anyone can view)
- Location: Supabase cloud storage

### Sets Up Permissions
- ✅ Anyone can **view** images
- ✅ Admin can **upload** images
- ✅ Admin can **delete** images

### Configures Limits
- Max file size: **5MB per image**
- Allowed types: **JPG, PNG, WEBP, GIF**

---

## 🐛 Troubleshooting

### "Permission denied" error
→ Run the SQL script in Supabase

### "Bucket already exists" error
→ Good! It's already set up. Try uploading.

### "Supabase not configured" error
→ Check environment variables in Vercel

### Upload succeeds but image doesn't show
→ Verify bucket is set to "Public" in Supabase Dashboard

---

## 📋 Quick Reference

**SQL File:** `supabase-storage-setup.sql` (in project root)

**What to copy:** Everything in that file

**Where to paste:** Supabase Dashboard → SQL Editor

**How long:** Takes 30 seconds

**Do it once:** Never need to run again

---

## 💡 After Setup

### Uploading Images:
1. Go to admin products page
2. Click "Add Product"
3. Drag images into upload box
4. Or click to browse files
5. See instant preview
6. Save product

### Image Features:
- ✅ Drag & drop
- ✅ Multiple images (up to 5)
- ✅ Instant preview
- ✅ Auto-upload to cloud
- ✅ Public URLs generated
- ✅ Mobile friendly

---

## 🔐 Security

**Safe:** Only allows image files  
**Limited:** Max 5MB per image  
**Public:** Anyone can view (good for e-commerce)  
**Controlled:** Only admin can upload/delete

---

## ⚡ Why This Setup?

**Before setup:**
- Images can't be uploaded
- No storage bucket exists
- API returns error

**After setup:**
- ✅ Drag & drop works
- ✅ Images stored in cloud
- ✅ Public URLs generated
- ✅ Fast and reliable

---

## 📞 Need Help?

### Can't find SQL Editor?
Look for **document icon** in left sidebar

### Script won't run?
Make sure you copied **entire** file content

### Still not working?
Check browser console for error messages

---

## 🎨 Visual Guide

```
Supabase Dashboard
    ↓
Click "SQL Editor" (left sidebar)
    ↓
Click "New query"
    ↓
Paste SQL script
    ↓
Click "Run" (or Ctrl+Enter)
    ↓
See success messages
    ↓
Click "Storage" to verify
    ↓
See "product-images" bucket
    ↓
Done! 🎉
```

---

## ✨ What You Get

After running the script:

### In Supabase:
- ✅ New storage bucket
- ✅ Proper permissions set
- ✅ File size limits configured
- ✅ MIME types restricted

### In Admin Panel:
- ✅ Upload box appears
- ✅ Drag & drop works
- ✅ Images preview instantly
- ✅ Upload to cloud
- ✅ URLs saved to database

### For Customers:
- ✅ Images load fast
- ✅ High quality display
- ✅ Reliable hosting
- ✅ Always available

---

## 🚀 Quick Start Commands

**No commands needed!** Just:
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Paste and run the script
4. Done in 30 seconds!

---

## 📊 Before vs After

### Before SQL Script:
```
Upload attempt
    ↓
❌ Error: Bucket not found
    ↓
Upload fails
```

### After SQL Script:
```
Upload attempt
    ↓
✅ File validated
    ↓
✅ Uploaded to Supabase
    ↓
✅ Public URL generated
    ↓
✅ Preview shown
    ↓
Success! 🎉
```

---

## 🎯 Success Checklist

Run the SQL script, then verify:

- [ ] No errors in SQL Editor
- [ ] Success messages appear
- [ ] "product-images" bucket visible in Storage
- [ ] Bucket shows "Public" badge
- [ ] Upload box appears in admin
- [ ] Can drag & drop images
- [ ] Preview shows instantly
- [ ] Images save successfully

**All checked?** You're ready! 🚀

---

## 📚 Related Files

- `supabase-storage-setup.sql` - **Run this script**
- `IMAGE_UPLOAD_SETUP.md` - Detailed guide
- `src/components/ImageUpload.tsx` - Upload component
- `src/app/api/upload-image/route.ts` - Upload API

---

## 🎉 Final Note

This is a **one-time setup** that takes **30 seconds**.

Once done, image upload works **forever** - no maintenance needed!

**Ready?** Go to Supabase Dashboard and run the script! 🚀

---

**File to run:** `supabase-storage-setup.sql`  
**Where:** Supabase Dashboard → SQL Editor  
**How long:** 30 seconds  
**Frequency:** Once  
**Result:** Image upload works! ✅
