#!/usr/bin/env node
const { ensureDir, copy } = require("fs-extra");
const fs = require("fs-extra");
const inquirer = require('inquirer');
const path = require('path');
const  { figletText } = require( "../utils/ascii-image");
const { Command } = require('commander');
const packageJson = require('../package.json');

const templates = {
  frontend: ['react-app', 'next-app', 'angular-app', 'vue-app',],
  frontendConsole: ['sunodo-frontend-console'],
  backend: ['js-template', 'ts-template', 'python-template'],
  cartesify: {
    backend: ['js-template', 'ts-template'],
    frontend: ['react-app', 'next-app']
  },
  mobileApp: ['react_native_app', 'react_native_with_expo', 'flutter_app']
};


async function ensureDirectory(dirPath) {
  return new Promise((resolve, reject) => {
    fs.access(dirPath, fs.constants.F_OK, (err) => {
      if (err) {
        // Directory does not exist, create it
        fs.mkdir(dirPath, { recursive: true }, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      } else {
        // Directory already exists, prompt user for confirmation
        inquirer
          .prompt({
            type: 'confirm',
            name: 'overwrite',
            message: `Directory '${dirPath}' already exists. Do you want to overwrite it?`,
            default: false
          })
          .then((answer) => {
            if (answer.overwrite) {
              // User wants to overwrite, remove existing directory and create new one
              fs.rm(dirPath, { recursive: true }, (error) => {
                if (error) {
                  reject(error);
                } else {
                  fs.mkdir(dirPath, { recursive: true }, (err) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve();
                    }
                  });
                }
              });
            } else {
              // User doesn't want to overwrite, exit the process
              console.log('Operation aborted.');
              process.exit(0);
            }
          });
      }
    });
  });
}

// Function to prompt user for template selection
async function promptTemplateSelection(templateType, choices) {
  const { selectedTemplate } = await inquirer.prompt({
    type: 'list',
    name: 'selectedTemplate',
    message: `Select ${templateType} template:`,
    choices: choices
  });
  return selectedTemplate;
}

// Function to prompt user for including a backend template
async function promptInclude(message, name) {
  const { includeBackend, includeFrontend, includeConsole } = await inquirer.prompt({
    type: 'confirm',
    name: name,
    message: message,
    default: false
  });
  return {includeBackend,includeFrontend, includeConsole };
}


// Function to copy template files to the project directory
async function copyTemplateFiles(templateName, destinationDir, templateDirectory) {
    let templateDir;
     templateDir = path.join(__dirname, templateDirectory, templateName);
  try {
    await ensureDir(templateDir); // Ensure template directory exists
    await copy(templateDir, destinationDir);
    console.log(`✔ Template ${templateName} app created successfully!` )
    // console.log(`Template files copied successfully to ${destinationDir}`);
  } catch (err) {
    console.error(`Error copying template files: ${err}`);
  }
}

// Main function
async function main() {

const program = new Command();
let projectName
  // Define the 'create' command
program
.version(packageJson.version, '-v, --version', 'Output the current version of your package')
.description('We are glad you are here💃')
.command('create  [name]')
.command('help', 'Display help for cartesikit')
.command('update', 'Update the cartesikit CLI')
.action((name) => {
  // projectName = process.argv[3];
  if (!name) {
    console.log("MissingError: Missing 1 required arg:\n  name  application and directory name\n  See more help with --help");
    process.exit(1);
  }
  // Implement the logic to create a new project here
});

// Add a '--help' option to display help information
program.option('--help', 'display help for command');

// Parse command-line arguments
program.parse(process.argv);

  console.log(await figletText)

  const projectDir = `${process.cwd()}/${projectName}`;
  await ensureDirectory(projectDir);

  const selectedTemplateType = await promptTemplateSelection('project', [
    { name: 'Frontend', value: 'frontend' },
    { name: 'Backend', value: 'backend' },
    { name: 'Cartesify', value: 'cartesify' },
    { name: 'Mobile App', value: 'mobileApp' },
  ]);

  let selectedFrontend, selectedBackend, selectedConsole
  let selectedMobile, selectedCartesifyBackend, selectedCartesifyFrontend


  switch (selectedTemplateType) {
    case 'frontend':
      selectedFrontend = await promptTemplateSelection('frontend', templates.frontend);
      const include = await promptInclude('Do you want to include a backend template?', "includeBackend")
      if (include.includeBackend) {
        selectedBackend = await promptTemplateSelection( 'backend', templates.backend);
      }
      break;
    case 'backend':
      selectedBackend = await promptTemplateSelection('backend', templates.backend);
      const includeFrontend = await promptInclude('Do you want to include a frontend template?', "includeFrontend")
      const includeConsole = await promptInclude('Do you want to include a frontend console template?', "includeConsole")

      if (includeFrontend.includeFrontend) {
        selectedFrontend = await promptTemplateSelection('frontend', templates.frontend);
      }
      if(includeConsole.includeConsole){
        selectedConsole = await promptTemplateSelection('frontendConsole', templates.frontendConsole )
      }
      break;
    case 'mobileApp':
      selectedMobile = await promptTemplateSelection('mobileApp', templates.mobileApp);
      const includeBackend = await promptInclude('Do you want to include a backend template?', "includeBackend")
      if (includeBackend.includeBackend) {
        selectedBackend = await promptTemplateSelection( 'backend', templates.backend);
      }
      break;
    case 'cartesify':
      selectedCartesifyBackend = await promptTemplateSelection('cartesify', templates.cartesify.backend)
      selectedCartesifyFrontend = await promptTemplateSelection('cartesify', templates.cartesify.frontend)
      break
  }

  const frontendProjectDir = `${projectDir}/frontend`;
  const backendProjectDir = `${projectDir}/backend`;
  const mobileProjectDir = `${projectDir}/mobile-app`
  
  // Copy template files
  if (selectedFrontend) {
    console.log(selectedFrontend)
    await copyTemplateFiles(selectedFrontend, frontendProjectDir, "apps/frontend");
  }
  if (selectedBackend) {
    await copyTemplateFiles(selectedBackend, backendProjectDir, "apps/backend");
  }
  if(selectedCartesifyBackend){
    await copyTemplateFiles(selectedCartesifyBackend, backendProjectDir, "apps/cartesify/backend"); 
  }
  if(selectedCartesifyFrontend){
    await copyTemplateFiles(selectedCartesifyFrontend, frontendProjectDir, "apps/cartesify/frontend"); 
  }
  if(selectedMobile){
    await copyTemplateFiles(selectedMobile, mobileProjectDir, "apps/mobileApp"); 
  }
  if(selectedConsole){
    await copyTemplateFiles(selectedConsole, projectDir, "apps/frontend")
  }
}

main();
