const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs-extra');

async function copyGitTemplateFiles(templateName, destinationDir, repositoryURL) {
    try {
        // Clone the repository
        const command = `git clone ${repositoryURL} ${destinationDir}`;
        await exec(command);

        // Remove the .git directory to remove Git initialization
        await fs.remove(`${destinationDir}/.git`);

        // Update package.json with the project directory name
        const packageJsonPath = `${destinationDir}/package.json`;
        if (await fs.pathExists(packageJsonPath)) {
            const packageJson = await fs.readJson(packageJsonPath);
            packageJson.name = templateName.toLowerCase(); // Assuming templateName is suitable for a package name
            await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
            // console.log(`✔ Package name updated to ${templateName.toLowerCase()} in ${packageJsonPath}`);
            console.log(`✔ Template ${templateName} created successfully!` )
        } else {
            console.warn(`Warning: No package.json found in ${destinationDir}.`);
        }

        console.log(`✔ Template ${templateName} cloned successfully from ${repositoryURL} to ${destinationDir}`);
    } catch (error) {
        console.error(`Error cloning template ${templateName} from ${repositoryURL}: ${error}`);
    }
}

module.exports{
  copyGitTemplateFiles
}