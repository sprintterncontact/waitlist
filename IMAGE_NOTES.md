# Image Replacement Guide

The hero section uses placeholder images from Unsplash. To replace them with your own images:

## Current Images:
1. **hero-image-1**: Business collaboration (https://images.unsplash.com/photo-1521737604893-d14cc237f11d)
2. **hero-image-2**: Team working together (https://images.unsplash.com/photo-1454165804606-c3d57bc86b40)
3. **hero-image-3**: Productivity and efficiency (https://images.unsplash.com/photo-1556761175-5973dc0f32e7)

## To Replace:

### Option 1: Use Local Images
1. Create a folder: `public/images/`
2. Add your images (recommended size: 400x300px or larger)
3. Update `src/App.js`:
   - Replace `src="https://images.unsplash.com/..."` 
   - With `src="/images/your-image-name.jpg"`

### Option 2: Use Your Own URLs
Simply replace the Unsplash URLs in `src/App.js` with your image URLs.

## Recommended Image Types:
- Professional business/collaboration scenes
- Team working together
- Modern office environments
- Productivity/productivity tools
- Small business contexts

## Image Specifications:
- Format: JPG or PNG
- Recommended size: 400x300px minimum
- Aspect ratio: 4:3 or 16:9
- File size: Optimized for web (< 200KB each)

