const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');
const inquirer = require('inquirer')

const frontendLogic = async (packagesDir) => {
  const { selectedFrontend, cloneConsole } = await inquirer.prompt([
    {
        type: 'list',
        name: 'selectedFrontend',
        message: 'Select a template for frontend:',
        choices: ['React', 'Next', 'sunodo-frontend-console']
    },
    {
        type: 'confirm',
        name: 'cloneConsole',
        message: 'Sunodo frontend console?'
    }
]);

const frontendDir = path.join(packagesDir, 'frontend');
fs.ensureDirSync(frontendDir);

if (selectedFrontend === 'React') {
    // Clone React template to frontend directory
    shell.exec(`git clone https://github.com/prototyp3-dev/frontend-web-cartesi.git ${frontendDir}`)

} else if (selectedFrontend === 'Next') {
    // Clone copy the nextApp from packagesDir to User frontend Dir
    const nextAppDir = path.join(packagesDir, 'next-app')
    fs.ensureDirSync(nextAppDir)
    fs.copySync(nextAppDir, frontendDir);
}

if (cloneConsole) {
    // Clone frontend console repo
    shell.exec(`git clone https://github.com/Mugen-Builders/sunodo-frontend-console.git ${frontendDir}/console`);
}

console.log('Your project has been successfully created enjoy!🎉');
}
  
module.exports = {
  frontendLogic
}