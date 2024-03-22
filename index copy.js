#!/usr/bin/env node

const { program } = require('commander');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define available templates
const templates = {
  backend: ['python', 'js', 'ts', 'rust', 'go'],
  frontend: ['react', 'nestjs', 'vuejs', 'angular'],
  cartesify: ['backend', 'frontend'],
  mobile: ['reactnative', 'flutter']
};

// Function to generate template
function generateTemplate(templateType, templateName) {
  // Define template directory
  const templateDir = path.join(__dirname, 'templates', templateType, templateName);

  // Check if template directory exists
  if (!fs.existsSync(templateDir)) {
    console.error(`Template ${templateType}/${templateName} not found`);
    return;
  }

  // Execute template generation command
  const command = 'git';
  const args = ['clone', templateDir, templateName];
  const result = spawnSync(command, args, { stdio: 'inherit' });

  if (result.status !== 0) {
    console.error(`Error generating template ${templateType}/${templateName}`);
    return;
  }

  console.log(`Template ${templateType}/${templateName} generated successfully`);
}

// Function to prompt user to select templates
async function selectTemplates() {
  // Prompt user to select templates for each template type
  const selectedTemplates = {};
  for (const type of Object.keys(templates)) {
    const { template } = await program
      .prompt(`Select template for ${type} (${templates[type].join(', ')}): `);
    selectedTemplates[type] = template;
  }
  return selectedTemplates;
}

// Define CLI command
program
  .version('1.0.0')
  .description('CLI tool to generate templates for backend, frontend, Cartesify, and mobile development')
  .action(async () => {
    // Select templates
    const selectedTemplates = await selectTemplates();

    // Generate templates based on selections
    for (const type of Object.keys(selectedTemplates)) {
      generateTemplate(type, selectedTemplates[type]);
    }
  });

// Parse CLI arguments
program.parse(process.argv);
