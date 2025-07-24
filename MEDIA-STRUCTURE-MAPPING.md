# REDUX Portfolio - Media File Structure Mapping

## Overview

This document provides a comprehensive mapping of all image and video files in the REDUX portfolio website, including their current locations, usage patterns, and optimization recommendations.

**Last Updated**: 2025-01-24  
**Status**: Complete mapping of existing files

---

## 1. Current File Structure

### 1.1 Video Files
```
/public/VIDEO/
├── main.mp4.mp4 (주요 백그라운드 비디오)
```

**Usage Locations:**
- `/src/app/about/collective/page.tsx` - Hero section background
- `/src/data/categories.ts` - Fashion Film category

**Issues:**
- ❌ Double extension: `.mp4.mp4` should be `.mp4`
- ⚠️ Only one video file for the entire site

### 1.2 Image Files Structure

#### About Section Images
```
/public/images/about/
├── memory/ (63 files)
│   ├── IMG_*.jpeg, IMG_*.jpg, IMG_*.JPG
│   └── KakaoTalk_20250626_002430368_*.jpg
├── process/ (6 files)
│   ├── 공간  연출.png
│   ├── 디렉팅.png
│   ├── 디지털  웹 디자인.png
│   ├── 아트 그래픽.png
│   ├── 영상 & 편집.png
│   └── 홍보  브랜딩.png
└── visual-art/ (8 files)
    ├── Analog Memories.png
    ├── Collective Vision.png
    ├── Color Theory.png
    ├── Digital Dreams.png
    ├── Form & Void.png
    ├── Metamorphosis.png
    ├── Shadow Play.png
    └── Texture Study.png
```

#### Designer Images
```
/public/images/designers/
├── choieunsol/
│   ├── choieunsol-Profile.jpeg
│   └── cinemode/ (5 files)
├── hwangjinsu/
│   └── cinemode/ (9 files - includes special characters ⭐️, 📌)
├── kimbomin/
│   ├── cinemode/ (4 files)
│   └── portfolio/ (4 files)
├── kimgyeongsu/
│   ├── Showcase/ (3 files)
│   └── portfolio/ (48+ files including videos)
├── leetaehyeon/
│   ├── leetaehyeon-Profile.jpg
│   ├── cinemode/ (2 files)
│   └── portfolio/ (2 files)
└── designer-placeholder.jpg
```

#### Exhibition Images
```
/public/images/exhibitions/
├── cinemode/ (4 files: 1.jpg - 4.jpg)
├── theroom/ (3 files: 1.jpg - 3.jpg)
└── exhibition-placeholder.jpg
```

#### Profile Images
```
/public/images/profile/
├── Choi Eunsol.jpeg
├── Hwang Jinsu.jpg
├── Kim Bomin.webp
├── Kim Gyeongsu.webp
├── Lee Taehyeon.jpg
└── Park Parang.jpg
```

#### Process & Other Images
```
/public/images/
├── process/ (6 files - duplicate of about/process/)
├── hero-background/
│   └── background.png
└── exhibition-placeholder.jpg
```

---

## 2. File Usage Analysis

### 2.1 Referenced in Data Files

**Categories Data (`/src/data/categories.ts`)**:
```typescript
// About categories cover images
'/images/about/process/홍보  브랜딩.png' - Collective
'/images/about/process/영상 & 편집.png' - Fashion Film  
'/images/about/memory/IMG_1728.jpeg' - Memory
'/images/about/visual-art/Analog Memories.png' - Visual Art
'/images/about/process/공간  연출.png' - Installation

// Video reference
'/VIDEO/main.mp4.mp4' - Fashion Film video
```

**Memory Gallery (63 images)**:
- All images in `/images/about/memory/` are used
- Mix of file extensions: .jpeg, .jpg, .JPG
- Includes KakaoTalk exported images

### 2.2 Referenced in Components

**Profile Images**:
- Used in designer detail pages
- Located in both `/images/designers/[name]/` and `/images/profile/`
- ⚠️ Potential duplication between directories

**Placeholder Images**:
- `designer-placeholder.jpg` - Used for missing designer photos
- `exhibition-placeholder.jpg` - Used for missing exhibition images

---

## 3. File Naming Conventions

### 3.1 Current Patterns
✅ **Good Patterns:**
- Profile images: `[name]-Profile.jpg`
- Exhibition folders: `cinemode/`, `theroom/`
- Sequential numbering: `1.jpg`, `2.jpg`, `3.jpg`

❌ **Problematic Patterns:**
- Double extensions: `main.mp4.mp4`
- Special characters in filenames: `⭐️NOR_7677.jpg`, `📌NOR_7689.jpg`
- Inconsistent casing: `.jpg` vs `.JPG` vs `.jpeg`
- Spaces in Korean filenames: `공간  연출.png` (double space)
- Mixed languages: Korean + English in same filename

### 3.2 Recommended Conventions
```
Videos: [purpose]-[version].mp4
Images: [category]-[purpose]-[sequence].jpg/png/webp
Profiles: [designer-name]-profile.jpg
Exhibitions: [exhibition-name]-[sequence].jpg
Process: [process-name].png
```

---

## 4. Issues & Recommendations

### 4.1 Critical Issues
1. **Video File Extension**: `main.mp4.mp4` → `main.mp4`
2. **Special Characters**: Remove emoji characters from filenames
3. **File Duplication**: `/images/process/` and `/images/about/process/`
4. **Inconsistent Extensions**: Standardize to `.jpg` for photos, `.png` for graphics

### 4.2 Performance Issues
1. **Large File Sizes**: Many unoptimized images
2. **No WebP Format**: Modern format not being used
3. **Missing Responsive Images**: No size variants

### 4.3 Organization Issues
1. **Profile Image Duplication**: Two locations for designer profiles
2. **Missing Alt Text Strategy**: No documentation for accessibility
3. **No Lazy Loading**: All images load immediately

---

## 5. File Optimization Plan

### 5.1 Immediate Actions
1. **Rename video file**: `main.mp4.mp4` → `main.mp4`
2. **Clean special characters** from filenames
3. **Standardize extensions**: Convert all to lowercase
4. **Remove duplicate process folder**

### 5.2 Next.js Image Optimization
```typescript
// Recommended next/image implementation
import Image from 'next/image'

// For designer profiles
<Image
  src="/images/profile/kim-bomin.jpg"
  alt="Kim Bomin - Creative Director"
  width={400}
  height={600}
  priority={isAboveTheFold}
/>

// For gallery images
<Image
  src="/images/about/memory/img-1728.jpg"
  alt="REDUX Collective Memory"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### 5.3 ImageKit Integration
```typescript
// Transform URLs for optimization
import { getImageKitUrl } from '@/lib/imagekit'

const optimizedUrl = getImageKitUrl('/images/profile/kim-bomin.jpg', {
  width: 400,
  height: 600,
  quality: 80,
  format: 'webp'
})
```

---

## 6. Missing Files Analysis

### 6.1 Files Referenced But Missing
- Some placeholder references in code may point to non-existent files
- Check all image references in components for 404s

### 6.2 Unused Files
- Audit all files to identify unused images
- Consider removing unused files to reduce bundle size

---

## 7. Implementation Checklist

### High Priority
- [ ] Fix video file extension: `main.mp4.mp4` → `main.mp4`
- [ ] Update all references in code to use correct paths
- [ ] Remove special characters from filenames
- [ ] Implement next/image for all image components

### Medium Priority
- [ ] Convert images to WebP format where appropriate
- [ ] Implement lazy loading for gallery images
- [ ] Add proper alt text for all images
- [ ] Remove duplicate process folder

### Low Priority
- [ ] Implement responsive image sizes
- [ ] Add image preloading for critical images
- [ ] Optimize image compression
- [ ] Implement progressive loading for large galleries

---

## 8. File Size Analysis

**Largest Files** (estimated):
- Designer portfolio images: ~1-5MB each
- Memory gallery images: ~500KB-2MB each
- Process graphics: ~100-500KB each

**Optimization Potential**:
- Reduce portfolio images to max 1MB
- Convert process graphics to WebP
- Implement responsive sizing

---

**Next Steps**: Implement immediate fixes, then proceed with Next.js image optimization and ImageKit integration.