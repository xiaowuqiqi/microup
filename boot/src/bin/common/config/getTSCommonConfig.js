const fs = require('fs');
const path = require('path');

export default function ts() {
  let my = {};
  if (fs.existsSync(path.resolve('tsconfig.json'))) {
    my = require(path.resolve('tsconfig.json'));
  } else {
    my = require('../../../../tsconfig');
  }
  return my.compilerOptions;
}
