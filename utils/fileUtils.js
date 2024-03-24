const { ensureDir, copy } = require("fs-extra");
const path = require('path');

 // Function to copy template files to the project directory
 async function copyTemplateFiles(templateName, destinationDir, templateDirectory) {
  let templateDir;
   templateDir = path.join(__dirname, templateDirectory, templateName);
  try {
    await ensureDir(templateDir); // Ensure template directory exists
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