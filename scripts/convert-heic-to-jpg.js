const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

async function convertHeicToJpg() {
  console.log('🔄 Starting HEIC to JPG conversion...');
  
  try {
    // Find all HEIC files
    const heicFiles = await glob('**/*.{heic,HEIC}', {
      cwd: process.cwd(),
      absolute: true,
      ignore: ['node_modules/**']
    });
    
    console.log(`📁 Found ${heicFiles.length} HEIC files to convert`);
    
    let converted = 0;
    let failed = 0;
    
    for (const heicPath of heicFiles) {
      const jpgPath = heicPath.replace(/\.(heic|HEIC)$/i, '.jpg');
      const fileName = path.basename(heicPath);
      
      try {
        console.log(`\n🖼️  Converting: ${fileName}`);
        
        // Check if JPG already exists
        if (fs.existsSync(jpgPath)) {
          console.log(`⚠️  JPG already exists, skipping: ${path.basename(jpgPath)}`);
          continue;
        }
        
        // Convert HEIC to JPG using sharp
        await sharp(heicPath)
          .jpeg({
            quality: 90,
            progressive: true,
            mozjpeg: true
          })
          .toFile(jpgPath);
        
        console.log(`✅ Converted successfully: ${fileName} → ${path.basename(jpgPath)}`);
        converted++;
        
        // Delete original HEIC file
        fs.unlinkSync(heicPath);
        console.log(`🗑️  Deleted original HEIC file: ${fileName}`);
        
      } catch (error) {
        console.error(`❌ Failed to convert ${fileName}: ${error.message}`);
        failed++;
      }
    }
    
    console.log('\n📊 Conversion Summary:');
    console.log(`✅ Successfully converted: ${converted} files`);
    console.log(`❌ Failed conversions: ${failed} files`);
    console.log('✨ HEIC to JPG conversion completed!');
    
  } catch (error) {
    console.error('💥 Fatal error during conversion:', error);
    process.exit(1);
  }
}

// Run the conversion
convertHeicToJpg();