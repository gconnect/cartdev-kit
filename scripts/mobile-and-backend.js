const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');
const inquirer = require('inquirer');
const { figletText } = require('../utils/ascii-image');
const { backendLogic } = require('./backend');

const mobileAndBackendLogic = async(packagesDir) =>{

    const { selectedOption } = await inquirer.prompt({
        type: 'list',
        name: 'selectedBackend',
        message: 'Select a template for backend:',
        choices: ['Flutter', 'React-Native']
    });
  
    if (selectedOption === 'Flutter') {
        // Copy the js backend template  
    const flutterAppDir = path.join(packagesDir, 'flutter-app')
    fs.ensureDirSync(flutterAppDir)
    fs.copySync(packagesDir, flutterAppDir);
  
    } else if (selectedOption === 'React-Native') {
        // Copy the ts backend template   
        const reactNativeDir = path.join(packagesDir, 'react-native-app')
        fs.ensureDirSync(reactNativeDir)      
        fs.copySync(packagesDir, reactNativeDir);
    }
    await backendLogic()
    console.log(figletText)
  } 

module.exports ={
  mobileAndBackendLogic
}