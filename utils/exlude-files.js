const fs = require('fs-extra');
const path = require('path');


const filesToExclude = ['.git', '.env', 'node_modules', 'package-lock.json', 'yarn-lock'];

const exludeFiles = (sourceDir, destDir) => {
  // Check if the source directory exists
  if (fs.existsSync(sourceDir)) {
    // Get all files and directories in the source directory
    const files = fs.readdirSync(sourceDir);

    // Filter out files and directories to exclude
    const filesToCopy = files.filter(file => {
      !filesToExclude.includes(file)
    });
    // Copy each file to the destination directory
    filesToCopy.forEach(file => {
        const sourceFilePath = path.join(sourceDir, file);
        const destFilePath = path.join(destDir, file);
        fs.copyFileSync(sourceFilePath, destFilePath);
    });
  } else {
    console.error('Source directory does not exist.');
  }
}


module.exports = {
  exludeFiles
}