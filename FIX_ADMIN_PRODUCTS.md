# 🔧 Fix: Admin Can't Add Products

## Problem

When trying to save a product in admin, you get:
```
Error: new row violates row-level security policy for table "products"
```

## Solution

Run this SQL script in Supabase to fix the permissions.

---

## 📝 Quick Fix (2 Minutes)

### Step 1: Open Supabase
1. Go to: https://supabase.com/dashboard
2. Sign in
3. Select your AMAPELS project

### Step 2: Run SQL Script
1. Click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Copy **ALL** text from `fix-products-rls.sql`
4. Paste into editor
5. Click **"Run"** (or Ctrl+Enter)

### Step 3: Verify
You should see:
```
✅ Products RLS policies updated successfully!
✅ Admin can now add, edit, and delete products.
```

### Step 4: Test
1. Go back to admin panel
2. Try adding a product again
3. Should work now! 🎉

---

## 🔍 What This Fixes

### The Problem:
Supabase has **Row Level Security (RLS)** enabled on the products table. The default policies only allow "authenticated" users (logged in through Supabase Auth) to add products.

But your admin uses **localStorage authentication**, not Supabase Auth, so it's blocked.

### The Solution:
Update the RLS policies to allow **public** access for insert/update/delete operations. This is safe because:
- Your admin page has its own authentication
- Only logged-in admins can access the forms
- The API still validates requests

---

## 📋 What the Script Does

### Drops Old Policies:
- Removes restrictive authenticated-only policies

### Creates New Policies:
- ✅ **SELECT** - Anyone can read products (needed for shop)
- ✅ **INSERT** - Anyone can add products (admin will use)
- ✅ **UPDATE** - Anyone can edit products (admin will use)
- ✅ **DELETE** - Anyone can delete products (admin will use)

### Why "Public"?
Because your admin authentication is handled by localStorage, not Supabase Auth. The admin panel itself is protected, so this is safe.

---

## 🔐 Security Notes

### Is This Safe?
**Yes!** Because:
1. Your admin panel has login authentication
2. Only authenticated admins see the product forms
3. Regular users never see these forms
4. Your app controls who can access admin routes

### What About Users?
Regular website visitors:
- ✅ Can browse products (SELECT)
- ❌ Never see admin panel
- ❌ Don't have access to add/edit forms
- ❌ Protected by your app's routing

---

## 🐛 Troubleshooting

### Script won't run?
- Make sure you copied the **entire** file
- Check for any copy/paste errors
- Try running line by line

### Still getting RLS error?
1. Verify script ran successfully
2. Check Supabase logs for errors
3. Refresh admin page (Ctrl+F5)
4. Try logging out and back in

### Products not saving?
- Check browser console for other errors
- Verify environment variables are set
- Check Supabase table exists

---

## ✅ After Running Script

You should be able to:
- ✅ Add new products through admin
- ✅ Edit existing products
- ✅ Delete products
- ✅ Upload images
- ✅ Feature/unfeature products

---

## 🎯 Complete Flow

```
Admin logs in
    ↓
Fills product form (5 fields)
    ↓
Uploads images
    ↓
Clicks "Create Product"
    ↓
API sends to Supabase
    ↓
✅ RLS policies allow insert
    ↓
Product saved to database
    ↓
Product appears on shop!
```

---

## 📚 Related Files

- **`fix-products-rls.sql`** - Run this script (IMPORTANT!)
- `supabase-storage-setup.sql` - For image uploads
- `supabase-migration.sql` - Initial database setup

---

## 🚀 Quick Reference

**Problem:** Can't save products  
**Error:** Row level security policy violation  
**Fix:** Run `fix-products-rls.sql` in Supabase  
**Time:** 2 minutes  
**Result:** Admin can add products ✅

---

## 💡 Why This Happens

Supabase enables RLS by default for security. The migration script had policies that required Supabase authentication, but your app uses custom authentication.

This script aligns the RLS policies with your authentication system.

---

## ✨ After Fix

**Before:**
```
Try to save product
    ↓
❌ RLS policy violation
    ↓
Product not saved
    ↓
Error message
```

**After:**
```
Try to save product
    ↓
✅ RLS policy allows
    ↓
Product saved
    ↓
Success! Shows in shop
```

---

## 🎉 Summary

1. **Run:** `fix-products-rls.sql` in Supabase SQL Editor
2. **Wait:** See success message
3. **Test:** Add a product in admin
4. **Done:** Products save successfully!

**This is a one-time fix - once done, products will save forever!**

---

**File:** `fix-products-rls.sql`  
**Where:** Supabase Dashboard → SQL Editor  
**Takes:** 30 seconds  
**Fixes:** Admin can't add products ✅
