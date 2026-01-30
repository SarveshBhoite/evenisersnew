const fs = require('fs');
const path = require('path');

// 1. Target the images folder
const imagesDir = path.join(__dirname, 'data', 'babywelcome');

console.log(`📂 Scanning folder: ${imagesDir}...`);

if (!fs.existsSync(imagesDir)) {
    console.error("❌ Error: Could not find the images folder. Please check the path.");
    process.exit(1);
}

// 2. Read and Rename
fs.readdir(imagesDir, (err, files) => {
    if (err) {
        console.error("❌ Error reading folder:", err);
        return;
    }

    let count = 0;

    files.forEach(file => {
        // Check if file is a PNG
        if (path.extname(file).toLowerCase() === '.png') {
            const oldPath = path.join(imagesDir, file);
            
            // Replace .png with .jpg
            const newFilename = file.replace(/\.png$/i, '.jpg'); 
            const newPath = path.join(imagesDir, newFilename);

            // Rename the file
            fs.renameSync(oldPath, newPath);
            console.log(`✅ Renamed: ${file}  -->  ${newFilename}`);
            count++;
        }
    });

    if (count === 0) {
        console.log("\n⚠️  No .png files found to rename.");
    } else {
        console.log(`\n🎉 Success! Renamed ${count} files to .jpg`);
    }
});