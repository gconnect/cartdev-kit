#!/usr/bin/env node

const inquirer = require('inquirer');
const {ensureDir, readdir} = require("fs-extra");
const shell = require("shelljs");

// Import chalk dynamically
let chalkPromise = import('chalk');
let oraPromise = import('ora');

const templates = {
    frontend: ['react-app', 'next-app', 'angular-app', 'vue-app', 'sunodo-frontend-console'],
    backend: ['js-template', 'ts-template', 'python-template'],
    cartesify: {
        backend: ['js-template', 'ts-template'],
        frontend: ['react-app', 'next-app']
    },
    mobileApp: ['react_native_app', 'react_native_with_expo', 'flutter_app']
};

const BASE_URL = 'https://github.com/gconnect/cartesi-kit';


async function main() {
  const args = process.argv.slice(3);
  const projectName = args[0];
  if(!projectName){
    console.log("Please provide the name of the app");
    process.exit(1);
  }

    const projectDir = `${process.cwd()}/${projectName}`;

    // Ensure the output directory exists
     ensureDir(projectDir);

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'selectedFrontend',
            message: 'Select frontend template(s):',
            choices: templates.frontend
        },
        {
            type: 'list',
            name: 'selectedBackend',
            message: 'Select backend template(s):',
            choices: templates.backend
        },
        {
            type: 'confirm',
            name: 'includeSunodoFrontendConsole',
            default: "No",
            message: 'Include sunodo-frontend-console?',
            when: (answers) => answers.selectedFrontend.length > 0 || answers.selectedBackend.length > 0
        },
        {
            type: 'list',
            name: 'selectedMobileApp',
            message: 'Select mobile app template(s):',
            choices: templates.mobileApp,
            when: (answers) => answers.selectedFrontend.length > 0 || answers.selectedBackend.length > 0
        }
    ]);

    // Copy selected templates to project directory
    await copyTemplates(answers, projectDir);
    // customizePackageJson(projectDir, projectName)

}

async function copyTemplates(answers, projectDir) {
    // Wait for chalk to be imported before using it
    const chalk = await chalkPromise;

    const selectedTemplates = [...answers.selectedFrontend, ...answers.selectedBackend];

    if (answers.includeSunodoFrontendConsole) {
        selectedTemplates.push('sunodo-frontend-console');
    }

    selectedTemplates.forEach(template => {
        const sourceDir = resolveTemplateDir(template);
        if (sourceDir) {
            // shell.exec(`git clone --depth 2 ${BASE_URL} ${projectDir}/${template}`);
            
            // Shell commands to clone and trim the required directories
            shell.cd(pwd);
            shell.exec(
              `git clone --depth 2 --filter=blob:none --sparse ${BASE_URL} ${projectName}`
            );
            shell.cd(projectName);

        }
    });

    console.log(('Templates copied successfully!'));
}

async function resolveTemplateDir(template) {
  const chalk = await chalkPromise;

  if (templates.frontend.includes(template) || templates.backend.includes(template)) {
    return `${BASE_URL}/${template}`;
} else if (templates.cartesify.frontend.includes(template)) {
    return `${BASE_URL}/cartesify/frontend/${template}`;
} else if (templates.cartesify.backend.includes(template)) {
    return `${BASE_URL}/cartesify/backend/${template}`;
} else if (templates.mobileApp.includes(template)) {
    return `${BASE_URL}/mobile-app/${template}`;
}

console.log((`Template '${template}' not found.`));
return null;
}

// function customizePackageJson(projectDir, projectName) {
//   const packageJsonPath = `${projectDir}/package.json`;
//   if (fs.existsSync(packageJsonPath)) {
//       const packageJson = require(packageJsonPath);
//       packageJson.name = projectName;
//       fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
//   } else {
//       console.log(('package.json not found.'));
//   }
// }


main()
// module.exports = main

