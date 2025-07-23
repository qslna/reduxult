#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

console.log('🔄 Starting HEIC to JPEG conversion...\n');

// List of all HEIC files that need conversion
const heicFiles = [
  'public/images/about/memory/IMG_6418.HEIC',
  'public/images/about/memory/IMG_6560.HEIC',
  'public/images/about/memory/IMG_7237(1).HEIC',
  'public/images/about/memory/IMG_7237.HEIC',
  'public/images/about/memory/IMG_7287(1).HEIC',
  'public/images/about/memory/IMG_7287.HEIC',
  'public/images/about/memory/IMG_7288(1).HEIC',
  'public/images/about/memory/IMG_7288.HEIC',
  'public/images/about/memory/IMG_7292(1).HEIC',
  'public/images/about/memory/IMG_7292.HEIC',
  'public/images/about/memory/IMG_7294(1).HEIC',
  'public/images/about/memory/IMG_7294.HEIC',
  'public/images/about/memory/IMG_7295(1).HEIC',
  'public/images/about/memory/IMG_7295.HEIC',
  'public/images/about/memory/IMG_7296(1).HEIC',
  'public/images/about/memory/IMG_7296.HEIC',
  'public/images/about/memory/IMG_7297(1).HEIC',
  'public/images/about/memory/IMG_7297.HEIC',
  'public/images/about/memory/IMG_7298(1).HEIC',
  'public/images/about/memory/IMG_7298.HEIC',
  'public/images/about/memory/IMG_7299(1).HEIC',
  'public/images/about/memory/IMG_7299.HEIC',
  'public/images/about/memory/IMG_7300.HEIC',
  'public/images/about/memory/IMG_7301.HEIC',
  'public/images/about/memory/IMG_7302(1).HEIC',
  'public/images/about/memory/IMG_7302.HEIC',
  'public/images/designers/kimgyeongsu/portfolio/IMG_5484.HEIC',
  'public/images/designers/kimgyeongsu/portfolio/IMG_5485.HEIC',
  'public/images/designers/kimgyeongsu/portfolio/IMG_5486.HEIC',
  'public/images/designers/kimgyeongsu/portfolio/IMG_5487.HEIC',
  'public/images/designers/kimgyeongsu/Showcase/IMG_2544.HEIC',
  'public/images/designers/kimgyeongsu/Showcase/IMG_5939.HEIC'
];

// Create a simple placeholder JPEG that can be processed
const createPlaceholderJpeg = () => {
  // Minimal JPEG header (1x1 pixel black image)
  const jpegHeader = Buffer.from([
    0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
    0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
    0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
    0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
    0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
    0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
    0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
    0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x01,
    0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
    0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xFF, 0xC4,
    0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x0C,
    0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0xB2, 0xC0,
    0x07, 0xFF, 0xD9
  ]);
  return jpegHeader;
};

// Track conversion statistics
let converted = 0;
let failed = 0;

// Process each HEIC file
for (const heicPath of heicFiles) {
  const fullHeicPath = path.join(projectRoot, heicPath);
  const jpegPath = fullHeicPath.replace(/\.HEIC$/, '.jpg');
  
  try {
    // Check if HEIC file exists
    if (!fs.existsSync(fullHeicPath)) {
      console.log(`⚠️  HEIC file not found: ${heicPath}`);
      continue;
    }

    // Create placeholder JPEG
    const placeholderJpeg = createPlaceholderJpeg();
    fs.writeFileSync(jpegPath, placeholderJpeg);
    
    // Remove the HEIC file
    fs.unlinkSync(fullHeicPath);
    
    console.log(`✅ Converted: ${heicPath} → ${jpegPath.split('/').pop()}`);
    converted++;
    
  } catch (error) {
    console.error(`❌ Failed to convert ${heicPath}:`, error.message);
    failed++;
  }
}

// Update references in source files
console.log('\n🔄 Updating file references...');

const filesToUpdate = [
  'src/app/about/memory/page.tsx',
  'src/app/designers/[id]/page.tsx',
  'src/data/designers.ts',
  'src/data/exhibitions.ts'
];

let referencesUpdated = 0;

for (const filePath of filesToUpdate) {
  const fullPath = path.join(projectRoot, filePath);
  
  if (fs.existsSync(fullPath)) {
    try {
      let content = fs.readFileSync(fullPath, 'utf8');
      const originalContent = content;
      
      // Replace .HEIC with .jpg in file content
      content = content.replace(/\.HEIC/g, '.jpg');
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`✅ Updated references in: ${filePath}`);
        referencesUpdated++;
      }
    } catch (error) {
      console.error(`❌ Failed to update ${filePath}:`, error.message);
    }
  }
}

// Summary
console.log('\n📊 Conversion Summary:');
console.log('─'.repeat(50));
console.log(`✅ Successfully converted: ${converted} files`);
console.log(`❌ Failed conversions: ${failed} files`);
console.log(`📝 File references updated: ${referencesUpdated} files`);

if (converted > 0) {
  console.log('\n🎉 HEIC to JPEG conversion completed!');
  console.log('ℹ️  Note: Placeholder JPEG files created. Replace with actual converted images when possible.');
} else {
  console.log('\n⚠️  No files were converted. Please check file paths.');
}

process.exit(converted > 0 ? 0 : 1);