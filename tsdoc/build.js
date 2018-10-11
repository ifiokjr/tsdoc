'use strict';

const child_process = require('child_process');
const path = require('path');

const production = process.argv.indexOf('--production') >= 0;
const baseDir = __dirname;

process.exitCode = 1;

process.chdir(baseDir);

try {
  child_process.execSync(path.join(baseDir, 'node_modules/.bin/rimraf')
    + ' ./lib/', { stdio: 'inherit' });

  console.log('-- TYPESCRIPT --\n');
  child_process.execSync(path.join(baseDir, 'node_modules/.bin/tsc'), { stdio: 'inherit' });

  console.log('-- TSLINT --\n');
  child_process.execSync(path.join(baseDir, 'node_modules/.bin/tslint')
    + ' --config tslint.json --project . --rules-dir node_modules/tslint-microsoft-contrib',
    { stdio: 'inherit' });

  if (production) {
    console.log('-- JEST --\n');

    // Map stderr-->stdout because Jest weirdly writes to stderr during a successful run,
    // which the build tools (rightly so) interpret as an issue that should fail the build
    child_process.execSync(path.join(baseDir, 'node_modules/.bin/jest'), {
      stdio: [ 0, 1, 1 ]
    });
  }
} catch (e) {
  console.log('ERROR: ' + e.message);
}

process.exitCode = 0;
