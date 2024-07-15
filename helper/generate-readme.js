const fs = require("fs-extra")
const path = require('path');


const generateReadme = async (projectDir, projectName) => {
  const readmeContent = `# ${projectName}\n\nThis project was scaffolded using CartDevKit CLI tool.`;

  fs.writeFile(path.join(projectDir, 'README.md'), readmeContent, (err) => {
    if (err) {
      console.error(`Error generating README.md: ${err.message}`);
    } else {
      // console.log('README.md generated successfully.');
    }
  });

}

module.exports = {
  generateReadme
}