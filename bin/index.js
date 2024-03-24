#!/usr/bin/env node

const { Command } = require('commander');
const packageJson = require('../package.json');
const { createProject } = require('./create.js')

const program = new Command();

  // Define the 'create' command
program
.version(packageJson.version, '-v, --version', 'Output the current version of your package')
.description('We are glad you are here💃')
.command('create  [projectName]')
.command('help', 'Display help for cartesikit')
.command('update', 'Update the cartesikit CLI')
.action((projectName) => {
  // projectName = process.argv[3];
  if (!projectName) {
    console.log("MissingError: Missing 1 required arg:\n  name  application and directory name\n  See more help with --help");
    process.exit(1);
  }
  // Implement the logic to create a new project here
  createProject(projectName)
});

// Add a '--help' option to display help information
program.option('--help', 'display help for command');

// Parse command-line arguments
program.parse(process.argv);


