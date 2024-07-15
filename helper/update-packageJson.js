const fs = require('fs');
const path = require('path');

const updatePackageJson = (projectName, templateDir) => {
  const packageJsonPath = path.join(templateDir, 'package.json');

  // Check if the package.json file exists
  if (!fs.existsSync(packageJsonPath)) {
    // console.log(`No package.json found in ${templateDir}, continuing setup...`);
    return;
  }

  fs.readFile(packageJsonPath, 'utf8', (err, data) => {
    if (err) {
      // console.error(`Error reading package.json: ${err.message}`);
      // return;
      console.log('')
    }

    const packageJson = JSON.parse(data);
    packageJson.name = projectName;

    fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8', (err) => {
      if (err) {
        console.error(`Error updating package.json: ${err.message}`);
      } else {
        // console.log('package.json updated successfully.');
      }
    });
  });
};

module.exports = { updatePackageJson };
