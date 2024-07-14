const fs = require("fs-extra")
const { execSync } = require('child_process');


const generateMonorepo = async (projectDir) => {
  console.log('Setting up workspace and installing dependencies...');
  fs.ensureDirSync(projectDir);
  console.log(`Changing directory to: ${projectDir}`);
  process.chdir(projectDir);

  // Initialize the monorepo structure in the project root
  console.log('Initializing monorepo...');
  await fs.writeJson('lerna.json', {
    "packages": [
      "packages/*"
    ],
    "version": "0.0.0"
  }, { spaces: 2 });

  await fs.writeJson('package.json', {
    "name": "monorepo-workspace",
    "private": true,
    "devDependencies": {
      "lerna": "^5.0.0"
    },
    "workspaces": [
      "packages/*"
    ]
  }, { spaces: 2 });

  console.log('Monorepo initialized. Installing global dependencies...');

  try {
    execSync('npm install -g lerna yarn', { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error installing global dependencies: ${error.message}`);
    return;
  }

  // console.log('Global dependencies installed. Installing project dependencies...');

  // try {
  //   execSync('npm install', { stdio: 'inherit' });
  // } catch (error) {
  //   console.error(`Error installing project dependencies: ${error.message}`);
  //   return;
  // }

  // console.log('Project dependencies installed. Initializing Lerna...');

  try {
    execSync('lerna init', { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error initializing Lerna: ${error.message}`);
    return;
  }

  console.log('Lerna initialized successfully.');
}

module.exports = {
  generateMonorepo
}