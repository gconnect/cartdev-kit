// Function to install dependencies
const { copyTemplateFiles } = require("./copy-template-files")
const { exec } = require('child_process');
const fs = require("fs-extra")

 const installDependencies = async (templateName, destinationDir, templateDirectory) => {
  console.log('Installing dependencies...');
  fs.ensureDir(destinationDir)
  console.log(destinationDir)
  process.chdir(destinationDir);

  // npm install -g lerna && npm install -g yarn && lerna init

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




