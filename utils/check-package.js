const { ensureDir, copy } = require("fs-extra");

function isPackageInstalled(packageName) {
    try {
        // Try to require the package
        require.resolve(packageName);
        // If require.resolve doesn't throw an error, the package is installed
        return true;
    } catch (error) {
        // If an error occurs, the package is not installed
        return false;
    }
}

module.exports = {
  isPackageInstalled,
}