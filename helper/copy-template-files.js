const { ensureDir, copy } = require("fs-extra");
const {ensureDirectory} = require('../utils/directoryUtils')
const fs = require("fs-extra");
const path = require('path');
const { exludeFiles } = require("../utils/exlude-files");

 // Function to copy template files to the project directory
 async function copyTemplateFiles(templateName, destinationDir, templateDirectory) {
  let templateDir;
   templateDir = path.join(process.cwd(), templateDirectory, templateName);
  try {
    await ensureDir(templateDir); // Ensure template directory exists
    // Function to filter out .git, .env, node_modules, and package-lock.json files/directories
    exludeFiles(templateDir, destinationDir)
    await copy(templateDir, destinationDir);
    
    console.log(`✔ Template ${templateName} created successfully!` )
    // console.log(`Template files copied successfully to ${destinationDir}`);
  } catch (err) {
    console.error(`Error copying template files: ${err}`);
  }
}


module.exports = {
    copyTemplateFiles
};