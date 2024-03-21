const { backendLogic } = require("./backend")
const { frontendLogic } = require("./frontend")
const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');
const inquirer = require('inquirer')

const fullstackLogic = async (packagesDir) => {

  const { selectedOption } = await inquirer.prompt([{
    type: 'list',
    name: 'selectedOption',
    message: 'Select a template for backend:',
    choices: ['Sunodo backend & frontend', 'Cartesify']
  }
]);

  if(selectedOption === 'Sunodo backend & frontend'){
    await backendLogic(packagesDir)
    await frontendLogic(packagesDir)
  }
  if (selectedOption === 'Cartesify') {
    // Clone Cartesify template directly to project root directory
    shell.exec(`git clone https://github.com/Calindra/cartesify-template/tree/main/backend ${packagesDir}`);
    console.log('Cartesify template added to your project.');
}
}

module.exports = {
  fullstackLogic
}