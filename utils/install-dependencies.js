// Function to install dependencies
const { copyTemplateFiles } = require("../utils/fileUtils")
const { exec } = require('child_process');
const fs = require("fs-extra")
 const installDependencies = async (templateName, destinationDir, templateDirectory) => {
  console.log('Installing dependencies...');
  fs.ensureDir(destinationDir)
  process.chdir(destinationDir);
  exec('npm install', (error, stdout, stderr) => {
      if (error) {
          console.error(`Error installing dependencies: ${error.message}`);
          return;
      }
      if (stderr) {
          console.error(`Error installing dependencies: ${stderr}`);
          return;
      }
      console.log(`Dependencies installed: ${stdout}`);
      copyTemplateFiles(templateName, destinationDir, templateDirectory)
  });
}

module.exports = { 
  installDependencies
}