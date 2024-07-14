#!/usr/bin/env node

const { Command } = require('commander');
const packageJson = require('../package.json');
const { createProject } = require('./create')

const program = new Command();

  // Define the 'create' command
program
.version(packageJson.version, '-v, --version', 'Output the current version of your package')
.command('create  [projectName]').description("Create new project")
.action((projectName, options) => {
    if(options.help){
      console.log("frontend selected....")
    }
  if (!projectName) {
    console.log("MissingError: Missing 1 required arg:\n  name  application and directory name\n  See more help with --help");
    process.exit(1);
  }
  // Implement the logic to create a new project here
  createProject(projectName)
});

program.command('help').description('Display help for cartdevkit')
program.option('--help', 'display help for command')

// Parse command-line arguments
program.parse(process.argv);
