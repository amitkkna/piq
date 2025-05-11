const fs = require('fs');
const path = require('path');

// Copy the _redirects file to the out directory
console.log('Copying _redirects file to out directory...');
try {
  if (!fs.existsSync('out')) {
    fs.mkdirSync('out', { recursive: true });
  }
  
  fs.copyFileSync(
    path.join('public', '_redirects'),
    path.join('out', '_redirects')
  );
  console.log('Successfully copied _redirects file');
} catch (error) {
  console.error('Error copying _redirects file:', error);
}

// Copy other public files if needed
console.log('Copying other public files to out directory...');
try {
  const publicFiles = fs.readdirSync('public');
  
  publicFiles.forEach(file => {
    if (file !== '_redirects') {
      const sourcePath = path.join('public', file);
      const destPath = path.join('out', file);
      
      if (fs.lstatSync(sourcePath).isFile()) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied ${file} to out directory`);
      } else {
        // For directories, copy recursively
        const copyRecursive = (src, dest) => {
          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
          }
          
          const entries = fs.readdirSync(src);
          
          for (const entry of entries) {
            const srcPath = path.join(src, entry);
            const destPath = path.join(dest, entry);
            
            if (fs.lstatSync(srcPath).isDirectory()) {
              copyRecursive(srcPath, destPath);
            } else {
              fs.copyFileSync(srcPath, destPath);
            }
          }
        };
        
        copyRecursive(sourcePath, destPath);
        console.log(`Copied directory ${file} to out directory`);
      }
    }
  });
  
  console.log('Successfully copied all public files');
} catch (error) {
  console.error('Error copying public files:', error);
}

console.log('Post-build process completed successfully!');
