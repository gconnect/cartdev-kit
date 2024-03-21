#!/usr/bin/env node
// Function to log your details in the terminal
const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');
const inquirer = require('inquirer')
const { mobileLogic } = require('./scripts/mobile-app');
const { frontendLogic } = require('./scripts/frontend');
const { fullstackLogic } = require('./scripts/fullstack');
const { backendLogic } = require('./scripts/backend')
// const { execSync } = require('child_process');


async function main() {
  const args = process.argv.slice(2)
  const appName = args[0]
  if(!appName){
    console.log("Please provide the name of the app")
    process.exit(1)
  }
  try {
    const packagesDir = path.join(process.cwd(), appName);
    fs.ensureDirSync(packagesDir);

      const { projectType } = await inquirer.prompt({
          type: 'list',
          name: 'projectType',
          message: 'What type of project template do you want?',
          choices:['Fullstack', 'Backend Only', 'Frontend Only', 'Mobile DApp', 'Mobile With Backend']
      });
      if(projectType === 'Fullstack'){
        await fullstackLogic(packagesDir)
      }else if(projectType === 'Backend Only'){
        await backendLogic(packagesDir)
      }else if(projectType === 'Frontend Only'){
        await frontendLogic(packagesDir)
      }else if(projectType == 'Mobile DApp'){
        await mobileLogic(packagesDir)
      }
    else if(projectType == 'Mobile With Backend'){
      await mobileLogic(packagesDir)
    }
  } catch (error) {
      console.error("An error occurred:", error);
  }
}
main();

