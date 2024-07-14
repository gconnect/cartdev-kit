const { ensureDir, copy } = require("fs-extra");
const path = require('path');
const { exludeFiles } = require("../utils/exlude-files");
const { spawn } = require('child_process');

const { installDependencies } = require("./install-dependencies")


const runCommand = (command, args, options = {}) => {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { stdio: 'inherit', ...options });
    process.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Process exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
};

 // Function to copy template files to the project directory
 async function copyTemplateFiles(templateName, destinationDir, templateDirectory) {
  
  try {
      // Use spawn to run the npm install command and log the progress
  runCommand('npm', ['install'], { stdio: 'inherit' })
   const templateDir = path.resolve(__dirname,'..', templateDirectory, templateName);
   const destDir = path.resolve(process.cwd(), destinationDir);
   await ensureDir(destDir); // Ensure template directory exists
    // Function to filter out .git, .env, node_modules, and package-lock.json files/directories
    exludeFiles(templateDir, destDir)
    await copy(templateDir, destDir);
    console.log(`✅ Template ${templateName} created successfully!` )

  } catch (err) {
    console.error(`Error copying template files: ${err}`);
  }
}


module.exports = {
    copyTemplateFiles
};