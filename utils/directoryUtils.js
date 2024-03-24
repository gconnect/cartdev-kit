const fs = require("fs-extra");
const inquirer = require('inquirer');

async function ensureDirectory(dirPath) {
  return new Promise((resolve, reject) => {
    fs.access(dirPath, fs.constants.F_OK, (err) => {
      if (err) {
        // Directory does not exist, create it
        fs.mkdir(dirPath, { recursive: true }, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      } else {
        // Directory already exists, prompt user for confirmation
        inquirer
          .prompt({
            type: 'confirm',
            name: 'overwrite',
            message: `Directory '${dirPath}' already exists. Do you want to overwrite it?`,
            default: false
          })
          .then((answer) => {
            if (answer.overwrite) {
              // User wants to overwrite, remove existing directory and create new one
              fs.rm(dirPath, { recursive: true }, (error) => {
                if (error) {
                  reject(error);
                } else {
                  fs.mkdir(dirPath, { recursive: true }, (err) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve();
                    }
                  });
                }
              });
            } else {
              // User doesn't want to overwrite, exit the process
              console.log('Operation aborted.');
              process.exit(0);
            }
          });
      }
    });
  });
}

module.exports = {
  ensureDirectory
};