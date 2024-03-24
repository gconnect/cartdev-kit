const figlet = require('figlet');

const figletText = figlet('Cartesi Kit',
{
  font: "Colossal",
  horizontalLayout: "default",
  width: 100,
  // whitespaceBreak: true,
},
function(err, data) {
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