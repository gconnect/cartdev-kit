const figlet = require('figlet');

const figletText = figlet('Cartesi Kit', function(err, data) {
  if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
  }
  return data
});

module.exports ={
  figletText
}