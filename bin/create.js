// Main function
const { ensureDir, copy } = require("fs-extra");
const fs = require("fs-extra");
// const inquirer = require('inquirer');
const path = require('path');
const { ensureDirectory } = require('../utils/directoryUtils');
const { promptTemplateSelection, promptInclude } = require('../helper/promptUtils');
const { copyTemplateFiles, printSuccessMessage } = require('../helper/copy-template-files');
const  { figletText } = require( "../utils/ascii-image");
const { copyGitTemplateFiles } = require("../helper/fetch-git-repo")
const { generateReadme } = require("../helper/generate-readme")


async function createProject(projectName) {

  const { default: chalk } = await import('chalk');

  const inquirer = await import('inquirer');

  const templates = {
    // frontend: ['react-app', 'next-app', 'angular-app', 'vue-app'],
    frontend: ['react-app', 'next-app'],
    // frontendConsole: ['sunodo-frontend-console-cli'],
    backend: ['js-template', 'ts-template'],
    cartesify: {
      backend: ['js-template', 'ts-template'],
      frontend: ['react-app', 'next-app']
    },
    // mobileApp: ['react_native_app', 'react_native_with_expo', 'flutter_app']
  };
  
    console.log(chalk.cyan(await figletText))
  
    const projectDir = path.resolve(process.cwd(), `${projectName}`);

    await ensureDirectory(projectDir);

    const selectedTemplateType = await promptTemplateSelection('project', [
      { name: 'Frontend', value: 'frontend' },
      { name: 'Backend', value: 'backend' },
      { name: 'Cartesify', value: 'cartesify' },
      // { name: 'Mobile App', value: 'mobileApp' },
    ]);
  
    let selectedFrontend, selectedBackend
    let selectedCartesifyBackend, selectedCartesifyFrontend
  
  
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
        // const includeConsole = await promptInclude('Do you want to include a frontend console template?', "includeConsole")
  
        if (includeFrontend.includeFrontend) {
          selectedFrontend = await promptTemplateSelection('frontend', templates.frontend);
        }
        // if(includeConsole.includeConsole){
        //   selectedConsole = await promptTemplateSelection('frontendConsole', templates.frontendConsole )
        // }
        break;
      // case 'mobileApp':
      //   selectedMobile = await promptTemplateSelection('mobileApp', templates.mobileApp);
      //   const includeBackend = await promptInclude('Do you want to include a backend template?', "includeBackend")
      //   if (includeBackend.includeBackend) {
      //     selectedBackend = await promptTemplateSelection( 'backend', templates.backend);
      //   }
      //   break;
      case 'cartesify':
        selectedCartesifyBackend = await promptTemplateSelection('cartesify', templates.cartesify.backend)
        selectedCartesifyFrontend = await promptTemplateSelection('cartesify', templates.cartesify.frontend)
        break
      // case 'frontendConsole':
      //   selectedConsole = await promptTemplateSelection('frontendConsole', templates.frontendConsole)
      //   break
    }
  
    const frontendProjectDir = `${projectDir}/frontend`;
    const backendProjectDir = `${projectDir}/backend`;
    // const mobileProjectDir = `${projectDir}/mobile-app`

    const templateArray = [`${projectDir}/frontend`,`${projectDir}/backend`, `${projectDir}/mobile-app` ]
  
    // Copy template files
    if (selectedFrontend) {
      console.log(selectedFrontend)
      await copyTemplateFiles(selectedFrontend, frontendProjectDir, "apps/frontend", projectName);
    }
    if (selectedBackend) {
      await copyTemplateFiles(selectedBackend, backendProjectDir, "apps/backend", projectName);
    }
    if(selectedCartesifyBackend){
      await copyTemplateFiles(selectedCartesifyBackend, backendProjectDir, "apps/cartesify/backend",projectName); 
    }
    if(selectedCartesifyFrontend){
      await copyTemplateFiles(selectedCartesifyFrontend, frontendProjectDir, "apps/cartesify/frontend", projectName); 
    }
    // if(selectedMobile){
    //   await copyTemplateFiles(selectedMobile, mobileProjectDir, "apps/mobileApp", projectName); 
    // }
    // if(selectedConsole){
    //   const giturl = "https://github.com/Mugen-Builders/sunodo-frontend-console.git"
    //   await copyGitTemplateFiles(selectedConsole, projectDir, giturl)
    // }
    console.log("Generating template...")
    await generateReadme(projectDir, projectName)
    await printSuccessMessage() 
  }
  
  module.exports = {
    createProject
  }