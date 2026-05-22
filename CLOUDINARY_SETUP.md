# Cloudinary Setup Guide for Redemption Week '26

This guide explains how to properly configure your Cloudinary account for the RW'26 platform. The app uses Cloudinary for three main things:
1. **Receipt Uploads** (Customer side - requires an "unsigned" preset)
2. **Product Images** (Admin side - uses secure "signed" server uploads)
3. **Landing Page Assets** (Manual uploads directly from your dashboard)

---

## 1. Finding Your Core Credentials
Before setting up the specific pipelines, grab your core credentials to add to your `.env.local` file.
1. Log in to your Cloudinary Console.
2. Go to **Settings** (gear icon) → **API Keys**.
3. You need three things:
   - **Cloud Name**: (e.g., `dxy123abc`)
   - **API Key**: (e.g., `123456789012345`)
   - **API Secret**: (e.g., `aBcDeFgHiJkLmNoPqRsTuVwXyZ`)

Add them to your `.env.local`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

---

## 2. Setting Up Receipt Uploads (Unsigned)
Because customers upload receipts directly from their browser, the app uses an **Unsigned Upload Preset**. This allows file uploads without exposing your secret API key.

### How to configure:
1. In the Cloudinary Dashboard, click the **Settings (gear icon)** at the bottom left.
2. Go to **Upload**.
3. Scroll down to the **Upload presets** section and click **Add upload preset**.
4. Configure the preset exactly like this:
   - **Upload preset name**: `rw26_receipts`
   - **Signing Mode**: `Unsigned` *(This is extremely important!)*
   - **Folder**: `rw26/receipts`
5. Click **Save** at the top right.

*Note: If you decide to name the preset something else, you must update the `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` variable in your `.env.local` file.*

---

## 3. Setting Up Product Image Uploads (Signed)
When administrators upload product variant images, the app securely uploads them from the server using your API Key and API Secret. You do **not** need to create an upload preset for this.

However, the app is configured to put these images in a specific folder to keep your dashboard organized.

- **Default Folder**: `rw26/products`
- *If you want to change this folder, you can set `CLOUDINARY_PRODUCTS_FOLDER="your/custom/folder"` in `.env.local`, but the default is highly recommended.*

As long as your `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` are correctly placed in `.env.local`, the admin dashboard will automatically handle product image uploads.

---

## 4. Manual Uploads for the Landing Page
For high-quality images used on the public-facing landing page (like the hero section, gallery, or banners), you should upload them manually through the Cloudinary Media Library.

### How to organize and upload:
1. In your Cloudinary Dashboard, go to **Media Library**.
2. Create a new folder. A good convention is `rw26/marketing` or `rw26/assets`.
3. Drag and drop your high-resolution images into this folder.
4. Once uploaded, click the **`< >` (Copy URL)** button on the image.
5. Paste this URL directly into your React components (e.g., `HeroSection.tsx`, `GallerySection.tsx`) replacing the `ph()` placeholder functions.

### Optimization Tip (Optional but recommended):
Cloudinary can automatically optimize images for the web. When copying the URL from Cloudinary, you can add `q_auto,f_auto` to the URL path to ensure the browser serves the most optimized format (like WebP) at the best quality.

Example URL:
`https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/rw26/assets/hero-bg.jpg`

Optimized URL:
`https://res.cloudinary.com/your_cloud_name/image/upload/q_auto,f_auto/v1234567890/rw26/assets/hero-bg.jpg`
