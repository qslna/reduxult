#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

console.log('🔍 Starting pre-build validation...\n');

let hasErrors = false;
let warnings = [];

// 1. Check for HEIC files
console.log('1️⃣ Checking for HEIC files...');
try {
  const heicFiles = glob.sync('**/*.{heic,HEIC}', {
    cwd: process.cwd(),
    ignore: ['node_modules/**', '.next/**']
  });
  
  if (heicFiles.length > 0) {
    console.error(`❌ Found ${heicFiles.length} HEIC files that need conversion:`);
    heicFiles.forEach(file => console.error(`   - ${file}`));
    hasErrors = true;
  } else {
    console.log('✅ No HEIC files found');
  }
} catch (error) {
  console.error('❌ Error checking HEIC files:', error.message);
  hasErrors = true;
}

// 2. Check vercel.json for deprecated images config
console.log('\n2️⃣ Checking vercel.json configuration...');
try {
  const vercelConfigPath = path.join(process.cwd(), 'vercel.json');
  if (fs.existsSync(vercelConfigPath)) {
    const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
    
    if (vercelConfig.images) {
      console.error('❌ vercel.json contains deprecated "images" configuration');
      console.error('   This will conflict with Next.js 13+ image optimization');
      hasErrors = true;
    } else {
      console.log('✅ vercel.json configuration is clean');
    }
  } else {
    console.log('ℹ️ No vercel.json found');
  }
} catch (error) {
  console.error('❌ Error checking vercel.json:', error.message);
  hasErrors = true;
}

// 3. Check next.config.js for proper image configuration
console.log('\n3️⃣ Checking next.config.js image settings...');
try {
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  if (fs.existsSync(nextConfigPath)) {
    const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
    
    if (nextConfigContent.includes('remotePatterns')) {
      console.log('✅ Using modern remotePatterns configuration');
    } else if (nextConfigContent.includes('domains')) {
      warnings.push('Using deprecated "domains" configuration. Consider upgrading to "remotePatterns"');
    }
    
    if (nextConfigContent.includes('ik.imagekit.io')) {
      console.log('✅ ImageKit domain is configured');
    } else {
      warnings.push('ImageKit domain not found in next.config.js');
    }
  } else {
    console.error('❌ next.config.js not found');
    hasErrors = true;
  }
} catch (error) {
  console.error('❌ Error checking next.config.js:', error.message);
  hasErrors = true;
}

// 4. Check for Image components with fill but no sizes
console.log('\n4️⃣ Checking Image components for missing sizes property...');
try {
  const tsxFiles = glob.sync('src/**/*.tsx', {
    cwd: process.cwd(),
    ignore: ['node_modules/**', '.next/**']
  });
  
  let imageIssues = [];
  
  for (const file of tsxFiles) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check if file imports Image from next/image
    if (content.includes("from 'next/image'") || content.includes('from "next/image"')) {
      const lines = content.split('\n');
      let inImageComponent = false;
      let hasFill = false;
      let hasSizes = false;
      let imageStartLine = 0;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.includes('<Image')) {
          inImageComponent = true;
          hasFill = false;
          hasSizes = false;
          imageStartLine = i + 1;
        }
        
        if (inImageComponent) {
          if (line.includes('fill')) {
            hasFill = true;
          }
          if (line.includes('sizes=')) {
            hasSizes = true;
          }
          
          if (line.includes('/>') || line.includes('</Image>')) {
            if (hasFill && !hasSizes) {
              imageIssues.push(`${file}:${imageStartLine} - Image with fill prop missing sizes`);
            }
            inImageComponent = false;
          }
        }
      }
    }
  }
  
  if (imageIssues.length > 0) {
    console.error(`❌ Found ${imageIssues.length} Image components with missing sizes:`);
    imageIssues.forEach(issue => console.error(`   - ${issue}`));
    hasErrors = true;
  } else {
    console.log('✅ All Image components have proper sizes configuration');
  }
} catch (error) {
  console.error('❌ Error checking Image components:', error.message);
  hasErrors = true;
}

// 5. Check for missing environment variables
console.log('\n5️⃣ Checking environment variables...');
const requiredEnvVars = [
  'NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY',
  'IMAGEKIT_PRIVATE_KEY',
  'IMAGEKIT_URL_ENDPOINT'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    warnings.push(`Environment variable ${envVar} is not set`);
  }
}

if (warnings.length === 0) {
  console.log('✅ All required environment variables are set');
} else {
  console.log('⚠️ Some environment variables may be missing (check .env files)');
}

// 6. Check package.json for required dependencies
console.log('\n6️⃣ Checking package.json dependencies...');
try {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const requiredDeps = ['next', 'react', 'sharp'];
  const missingDeps = requiredDeps.filter(dep => 
    !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
  );
  
  if (missingDeps.length > 0) {
    console.error(`❌ Missing required dependencies: ${missingDeps.join(', ')}`);
    hasErrors = true;
  } else {
    console.log('✅ All required dependencies are present');
  }
  
  // Check for sharp (required for image optimization)
  if (packageJson.dependencies.sharp || packageJson.devDependencies.sharp) {
    console.log('✅ Sharp is installed for image optimization');
  } else {
    warnings.push('Sharp is not installed - image optimization may be slower');
  }
} catch (error) {
  console.error('❌ Error checking package.json:', error.message);
  hasErrors = true;
}

// Summary
console.log('\n📊 Validation Summary:');
console.log('─'.repeat(50));

if (hasErrors) {
  console.error(`❌ ${hasErrors ? 'FAILED' : 'PASSED'} - Found critical issues that must be fixed`);
  process.exit(1);
} else if (warnings.length > 0) {
  console.log('⚠️ PASSED WITH WARNINGS');
  console.log('\nWarnings:');
  warnings.forEach(warning => console.log(`   - ${warning}`));
  process.exit(0);
} else {
  console.log('✅ ALL CHECKS PASSED - Ready for build!');
  process.exit(0);
}