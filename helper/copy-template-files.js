const { ensureDir, copy } = require("fs-extra");
const {ensureDirectory} = require('../utils/directoryUtils')
const fs = require("fs-extra");
const path = require('path');
const { exludeFiles } = require("../utils/exlude-files");
const { fileURLToPath } = require('url'); // For Node.js 14+

 // Function to copy template files to the project directory
 async function copyTemplateFiles(templateName, destinationDir, templateDirectory) {
  try {

   const templateDir = path.resolve(process.cwd(), templateDirectory, templateName);
   const destDir = path.resolve(process.cwd(), destinationDir);

    console.log('Template directory:', templateDir);
    console.log('Destination directory:', destDir);

    await ensureDir(destDir); // Ensure template directory exists
    // Function to filter out .git, .env, node_modules, and package-lock.json files/directories
    exludeFiles(templateDir, destDir)
    await copy(templateDir, destDir);
    
    console.log(`✔ Template ${templateName} created successfully!` )
    // console.log(`Template files copied successfully to ${destinationDir}`);
  } catch (err) {
    console.error(`Error copying template files: ${err}`);
  }
}


module.exports = {
    copyTemplateFiles
};