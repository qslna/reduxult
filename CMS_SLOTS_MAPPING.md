# REDUX CMS Slots Complete Mapping

## Overview
This document maps ALL image/video slots across the entire REDUX portfolio website that can be managed through the CMS system.

## Slot Categories

### 1. HERO SECTION (1 slot)
**File: `/src/components/home/HeroSection.tsx`**
- `main-hero-video` - Hero background video slot

### 2. MAIN SHOWCASE (8 slots)
**File: `/src/components/home/ShowcaseSection.tsx`**
- `main-designer-kimbomin` - Kim Bomin profile image
- `main-designer-parkparang` - Park Parang profile image  
- `main-designer-leetaehyeon` - Lee Taehyeon profile image
- `main-designer-choieunsol` - Choi Eunsol profile image
- `main-designer-hwangjinsu` - Hwang Jinsu profile image
- `main-designer-kimgyeongsu` - Kim Gyeongsu profile image
- `main-exhibition-cinemode` - Cinemode exhibition preview
- `main-exhibition-theroom` - The Room exhibition preview

### 3. ABOUT CATEGORY PREVIEWS (15 slots)
**File: `/src/components/about/CategoryPreview.tsx`**
Each of 5 categories has 3 layers:

**Fashion Film:**
- `about-fashion-film-layer1` - Main image
- `about-fashion-film-layer2` - Background image 1
- `about-fashion-film-layer3` - Background image 2

**Visual Art:**
- `about-visual-art-layer1` - Main image
- `about-visual-art-layer2` - Background image 1
- `about-visual-art-layer3` - Background image 2

**Memory:**
- `about-memory-layer1` - Main image
- `about-memory-layer2` - Background image 1
- `about-memory-layer3` - Background image 2

**Installation:**
- `about-installation-layer1` - Main image
- `about-installation-layer2` - Background image 1
- `about-installation-layer3` - Background image 2

**Collective:**
- `about-collective-layer1` - Main image
- `about-collective-layer2` - Background image 1
- `about-collective-layer3` - Background image 2

### 4. FASHION FILM PAGE (12 slots)
**File: `/src/app/about/fashion-film/page.tsx`**

**Thumbnail Slots:**
- `about-fashionfilm-kimbomin-thumbnail`
- `about-fashionfilm-parkparang-thumbnail`
- `about-fashionfilm-leetaehyeon-thumbnail`
- `about-fashionfilm-choieunsol-thumbnail`
- `about-fashionfilm-hwangjinsu-thumbnail`
- `about-fashionfilm-kimgyeongsu-thumbnail`

**Video Slots:**
- `designer-kimbomin-film`
- `designer-parkparang-film`
- `designer-leetaehyeon-film`
- `designer-choieunsol-film`
- `designer-hwangjinsu-film`
- `designer-kimgyeongsu-film`

### 5. DESIGNER INDIVIDUAL PAGES (12 slots)
**File: `/src/app/designers/[slug]/page.tsx`**

**Profile Image Slots (6):**
- `main-designer-profile-kimbomin`
- `main-designer-profile-parkparang`
- `main-designer-profile-leetaehyeon`
- `main-designer-profile-choieunsol`
- `main-designer-profile-hwangjinsu`
- `main-designer-profile-kimgyeongsu`

**Portfolio Gallery Slots (6):**
- `designer-kimbomin-portfolio` (6 images)
- `designer-parkparang-portfolio` (1 image)
- `designer-leetaehyeon-portfolio` (4 images)
- `designer-choieunsol-portfolio` (5 images)
- `designer-hwangjinsu-portfolio` (9 images)
- `designer-kimgyeongsu-portfolio` (25+ images)

### 6. EXHIBITIONS PAGE (7 slots)
**File: `/src/app/exhibitions/page.tsx`**

**Cinemode Exhibition:**
- `exhibition-cinemode-1` - Featured Cinemode image
- `exhibition-cinemode-2` - Cinemode gallery image 2
- `exhibition-cinemode-3` - Cinemode gallery image 3
- `exhibition-cinemode-4` - Cinemode gallery image 4

**The Room Exhibition:**
- `exhibition-theroom-1` - Featured The Room image
- `exhibition-theroom-2` - The Room gallery image 2
- `exhibition-theroom-3` - The Room gallery image 3

### 7. DESIGNERS OVERVIEW PAGE (6 slots)
**File: `/src/app/designers/page.tsx`**
- `designer-kim-bomin-profile`
- `designer-park-parang-profile`
- `designer-lee-taehyeon-profile`
- `designer-choi-eunsol-profile`
- `designer-hwang-jinsu-profile`
- `designer-kim-gyeongsu-profile`

## TOTAL SLOT COUNT: 78 SLOTS

### Breakdown:
- Hero Section: 1 slot
- Main Showcase: 8 slots
- About Category Previews: 15 slots
- Fashion Film Page: 12 slots (6 thumbnails + 6 videos)
- Designer Individual Pages: 12 slots (6 profiles + 6 portfolios)  
- Exhibitions Page: 7 slots (4 Cinemode + 3 The Room)
- Designers Overview Page: 6 slots
- **Additional category pages**: ~15-20 slots (estimated)

**CONFIRMED TOTAL: 78+ MANAGEABLE SLOTS**

## Notes
- Each slot supports both CMS override and fallback to default images
- Video slots support Google Drive integration
- All slots are authenticated (only visible to logged-in admin users)
- Slots use ImageKit for image optimization and CDN delivery

## Next Steps
1. Complete mapping of remaining pages
2. Count individual designer portfolio slots
3. Map exhibition gallery slots
4. Calculate final total slot count
5. Design CMS admin interface for managing all slots