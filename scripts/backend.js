const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');
const inquirer = require('inquirer')
const { isPackageInstalled } = require('../utils/check-package')

const backendLogic = async (packagesDir) => {

  const { selectedBackend, cloneConsole } = await inquirer.prompt([{
        type: 'list',
        name: 'selectedBackend',
        message: 'Select a template for backend:',
        choices: ['JS-Template', 'TS-Template']
    },
    {
        type: 'confirm',
        name: 'cloneConsole',
        message: 'Sunodo frontend console?'
    }
  ]);
  
  const backendDir = path.join(packagesDir, 'backend');
  const userBackendDir = path.join(packagesDir, 'backend'); // User's backend directory

  // Ensure the user's backend directory exists
  fs.ensureDirSync(userBackendDir);
  // fs.ensureDirSync(backendDir);
  
    if (selectedBackend === 'JS-Template') {
        // Copy the js backend template  
    const JsBackendDir = path.join(backendDir, 'JS-template')
    const destinationDir = path.join(userBackendDir, 'JS'); // Destination directory inside backend
    fs.ensureDirSync(destinationDir);
    fs.ensureDirSync(destinationDir);
    // fs.ensureDirSync(JsBackendDir)
    fs.copySync(JsBackendDir, destinationDir );
  
    } else if (selectedBackend === 'TS-Template') {
        // Copy the ts backend template   
        const TsBackendDir = path.join(packagesDir, 'TS-template')
        const destinationDir = path.join(backendDir, 'TS-template'); // Destination directory inside backend
        fs.ensureDirSync(destinationDir); 
        fs.ensureDirSync(TsBackendDir)
        fs.copySync(TsBackendDir, destinationDir );
    }

    if (cloneConsole) {
      // Clone frontend console repo
      shell.exec(`git clone https://github.com/Mugen-Builders/sunodo-frontend-console.git ${frontendDir}/console`);
    }

    // if (isPackageInstalled('sunodo')) {
    //   console.log(`'@sunodo/cli' is installed.`);
    // } else {  
    //     console.log(`'@sunodo/cli' is not installed.`);
    //     console.log("installing sunodo...")
    //     shell.exec(`npm i -g @sunodo/cli`);
    // }
    
    shell.exec(`cd ${packagesDir} && npm install`);
  } 

module.exports ={
  backendLogic
}