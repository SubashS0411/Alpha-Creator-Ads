const fs = require('fs');
const path = require('path');

// Source and destination directories
const sourceDir = path.join(__dirname, '../assests/samplevideos');
const destDir = path.join(__dirname, 'uploads/videos');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log('Created uploads/videos directory');
}

// Copy all video files
try {
  const videoFiles = fs.readdirSync(sourceDir).filter(file => file.endsWith('.mp4'));
  
  console.log(`Copying ${videoFiles.length} video files...`);
  
  for (const videoFile of videoFiles) {
    const sourcePath = path.join(sourceDir, videoFile);
    const destPath = path.join(destDir, videoFile);
    
    // Copy file if it doesn't exist in destination
    if (!fs.existsSync(destPath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✓ Copied: ${videoFile}`);
    } else {
      console.log(`⏭ Skipped (exists): ${videoFile}`);
    }
  }
  
  console.log('\n🎉 Video files copied successfully!');
  console.log(`📁 Videos are now available in: ${destDir}`);
  
} catch (error) {
  console.error('❌ Error copying videos:', error);
}