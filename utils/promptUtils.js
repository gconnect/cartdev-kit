
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


module.exports = {
  promptTemplateSelection,
  promptInclude
};