const { ensureDir, copy } = require("fs-extra");
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs-extra');
const { updatePackageJson } = require("../helper/update-packageJson")
const { hasPackageJson } = require("../utils/check-package")

// use this to see what is been installed
// const runCommand = (command, args, options = {}) => {
//   return new Promise((resolve, reject) => {
//     const process = spawn(command, args, { stdio: 'inherit', ...options });
//     process.on('close', (code) => {
//       if (code !== 0) {
//         reject(new Error(`Process exited with code ${code}`));
//       } else {
//         resolve();
//       }
//     });
//   });
// };

 // Function to copy template files to the project directory
 async function copyTemplateFiles(templateName, destinationDir, templateDirectory, projectName) {
    const { default: chalk } = await import('chalk');

    const filesToExclude = ['.git', '.env', 'node_modules', 'package-lock.json', 'yarn.lock', '.cartesi', '.next'];

  try {
  // Use spawn to run the npm install command and log the progress
  //  runCommand('npm', ['install'], { stdio: 'inherit' })
   const templateDir = path.resolve(__dirname,'..', templateDirectory, templateName);
   const destDir = path.resolve(process.cwd(), destinationDir);
   await ensureDir(destDir); // Ensure template directory exists
  
    if (fs.existsSync(templateDir)) {
      const files = fs.readdirSync(templateDir);
      const filesToCopy = files.filter(file => !filesToExclude.includes(file));
      filesToCopy.forEach(file => {
        const sourceFilePath = path.join(templateDir, file);
        const destFilePath = path.join(destDir, file);
        
        //update the package directory
        if(files.includes('package.json')){
          updatePackageJson(projectName, destDir)
        }

        // function to update the package.json name to the name of the project
        fs.copySync(sourceFilePath, destFilePath);
        // await copy(templateDir, destDir);
      });
      // console.log(`✅ Starter project successfully created!` )
      // console.log( "Thank you for using CartDevKit! If you have any questions or need further assistance, please refer to the README or reach out to our team.")
      // console.log(chalk.magenta("Happy coding! 🎉"))
    } else {
      console.error('Source directory does not exist.');
    }  
  } catch (err) {
    console.error(`Error copying template files: ${err}`);
  }
}

async function printSuccessMessage() {
  const { default: chalk } = await import('chalk');

  console.log( chalk.green(`🚀 Starter project successfully created!`));
  // console.log(chalk.bold('Before you start the project, please follow these steps:')) 
  // console.log( chalk.green('Run the following commands from your project folder to start the project:')) 

  // console.log(chalk.yellow(
  //   'yarn install'
  // ))
  // console.log('or')
  // console.log(chalk.yellow(
  //   'npm install'
  // ))
  // console.log('Depending on your preference')

  console.log(`${chalk.yellow('Thank you for using CartDevKit!')} If you have any questions or need further assistance, please refer to the README or reach out to our team.`);
  console.log("")
  console.log(chalk.magenta("Happy coding! 🎉"));
  console.log("")

}

module.exports = {
    copyTemplateFiles,
    printSuccessMessage
};