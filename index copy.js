#!/usr/bin/env node
// Function to log your details in the terminal

const figlet = require('figlet');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
// const { execSync } = require('child_process');


const figletText = figlet('Cartesi Kit', function(err, data) {
  if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
  }
  return data
});


async function main() {

  try {
    const { projectName } = await inquirer.prompt({
      type: 'input',
      name: 'projectName',
      message: 'Enter the name of your new project:'
    });

    console.log("projectName", projectName);
    
    const packagesDir = path.join(__dirname, 'packages');
    const packages = fs.readdirSync(packagesDir);

    const { selectedPackage } = await inquirer.prompt({
      type: 'list',
      name: 'selectedPackage',
      message: 'Select a package to include in your project:',
      choices: packages
    });

    const userProjectsDir = path.join(process.cwd(), projectName);
    const packageDir = path.join(packagesDir, selectedPackage);
    const userProjectDir = path.join(userProjectsDir, selectedPackage);

    if (fs.existsSync(packageDir)) {
      fs.ensureDirSync(userProjectDir);
      fs.copySync(packageDir, userProjectDir);
      console.log(`${selectedPackage} package added to your project.`);
      console.log(figletText);
    } else {
      console.error(`${selectedPackage} package does not exist.`);
    }
  } catch (error){console.log(error)}

}
main();

