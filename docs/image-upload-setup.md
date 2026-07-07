# Image Upload Setup Guide

This guide explains how to set up image upload functionality for the AMAPELS admin panel.

## Overview

Admins can now upload product images directly from their device. Images are stored in Supabase Storage and automatically integrated into the product database.

## Features

- ✅ Drag and drop or click to upload images
- ✅ Multiple image upload (up to 5 per product)
- ✅ Image preview with remove option
- ✅ File validation (type and size)
- ✅ Manual URL entry option (for existing images)
- ✅ Stored in Supabase Storage with public access

## Setup Instructions

### 1. Run Supabase Storage Setup

Open your Supabase Dashboard → SQL Editor and run the `supabase-storage-setup.sql` script:

```bash
# The script will:
- Create 'product-images' storage bucket
- Set up public access policies
- Configure 5MB file size limit
- Allow JPEG, PNG, WEBP, GIF formats
```

**Location:** `supabase-storage-setup.sql` in project root

### 2. Add Environment Variable (Optional)

For better security, add the service role key to your environment:

```env
# In .env.local
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Note:** The upload will work with the anon key, but the service role key is recommended for production.

### 3. Verify Supabase Dashboard

1. Go to Storage → Buckets
2. Confirm `product-images` bucket exists
3. Confirm "Public bucket" is checked
4. Check Policies tab to see access rules

## How to Use (Admin)

### Upload Images

1. Go to Admin → Products
2. Click "Add Product" or edit existing product
3. In the "Product Images" section:
   - Click the upload box or drag images
   - Select one or multiple images (up to 5)
   - Wait for upload to complete
   - Images appear as thumbnails

### Remove Images

- Hover over any image thumbnail
- Click the red X button in the corner
- Image is removed from the form

### Add Image URL Manually

- Click "Or add image URL manually"
- Enter the full URL (e.g., `/images/photo.jpg` or `https://...`)
- Image is added to the list

## Technical Details

### File Restrictions

- **Max file size:** 5MB per image
- **Max images:** 5 per product
- **Supported formats:** JPG, JPEG, PNG, WEBP, GIF
- **Upload location:** Supabase Storage → product-images bucket

### Upload Process

1. User selects file(s) from device
2. Client validates file type and size
3. File is uploaded to `/api/upload-image`
4. API uploads to Supabase Storage
5. Public URL is returned
6. URL is added to product images array
7. When product is saved, URLs are stored in database

### File Naming

Images are automatically renamed to prevent conflicts:
```
Format: {timestamp}-{random}.{extension}
Example: 1704067200000-abc123.jpg
Location: products/1704067200000-abc123.jpg
```

## API Endpoint

### POST /api/upload-image

**Request:**
```
Content-Type: multipart/form-data
Body: { file: File }
```

**Response:**
```json
{
  "success": true,
  "url": "https://your-project.supabase.co/storage/v1/object/public/product-images/products/123.jpg",
  "path": "products/123.jpg"
}
```

## Components

### ImageUpload Component
**Location:** `src/components/ImageUpload.tsx`

**Props:**
- `images: string[]` - Array of image URLs
- `onChange: (images: string[]) => void` - Callback when images change
- `maxImages?: number` - Maximum images allowed (default: 5)

### Updated Admin Products Page
**Location:** `src/app/admin/products/page.tsx`

Now uses `<ImageUpload>` component instead of manual text inputs.

## Troubleshooting

### Upload fails with "Supabase not configured"
- Check environment variables are set correctly
- Verify `NEXT_PUBLIC_SUPABASE_URL` and keys are in `.env.local`
- Restart the dev server

### Upload fails with "Row Level Security policy violation"
- Run the `supabase-storage-setup.sql` script
- Check bucket policies in Supabase Dashboard
- Ensure bucket is set to "Public"

### Images don't display after upload
- Check the returned URL in browser
- Verify bucket is public
- Check browser console for errors

### "File too large" error
- Ensure file is under 5MB
- Compress images before upload
- Use JPEG for photos (smaller than PNG)

## Next Steps

After setup is complete:

1. Test upload in admin panel
2. Verify images display on shop pages
3. Deploy to Vercel with updated environment variables
4. Test production deployment

## Support

If you encounter issues:
1. Check browser console for errors
2. Check Supabase logs in Dashboard → Logs
3. Verify all SQL scripts were run successfully
4. Ensure environment variables are set in both local and Vercel
