const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs-extra');
const { ensureDirectory } = require('../utils/directoryUtils')
async function copyGitTemplateFiles(templateName, destinationDir, repositoryURL) {
    try {
        await fs.ensureDir(destinationDir)
        // Clone the repository
        const command = `git clone ${repositoryURL} ${destinationDir}/sunodo-frontend-cli`;
        await exec(command);

        // Remove the .git directory to remove Git initialization
        await fs.remove(`${destinationDir}/sunodo-frontend-cli/.git`);

        // Update package.json with the project directory name
        const packageJsonPath = `${destinationDir}/sunodo-frontend-cli/package.json`;
        if (await fs.pathExists(packageJsonPath)) {
            const packageJson = await fs.readJson(packageJsonPath);
            packageJson.name = templateName.toLowerCase(); // Assuming templateName is suitable for a package name
            await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
            // console.log(`✔ Package name updated to ${templateName.toLowerCase()} in ${packageJsonPath}`);
            console.log(`✔ Template ${templateName} created successfully!` )
        } else {
            console.warn(`Warning: No package.json found in ${destinationDir}.`);
        }
    } catch (error) {
        console.error(`Error cloning template ${templateName} from ${repositoryURL}: ${error}`);
    }
}

module.exports = {
  copyGitTemplateFiles
}