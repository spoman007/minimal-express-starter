#! /usr/bin/env node
rmdir = require('rimraf');
const { spawn } = require('child_process');

const name = process.argv[2] || "sample";
if (!name || name.match(/[<>:"\/\\|?*\x00-\x1F]/)) {
  return console.log(`
  Invalid directory name.
  Usage: create-express-api name-of-api  
`);
}

const repoURL = 'https://github.com/spoman007/node-starter.git';

runCommand('git', ['clone', repoURL, name])
  .then(() => {
    rmdir(`${name}/.git`, function (error) { });
  }).then(() => {
    console.log('Installing dependencies...');
    return runCommand(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['install'], {
      cwd: process.cwd() + '/' + name
    });
  }).then(() => {
    console.log(`Done, get in ${name} directory and do a npm start 🔥🔥🔥`);
  });

function runCommand(command, args, options = undefined) {
  const spawned = spawn(command, args, options);

  return new Promise((resolve) => {
    spawned.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    spawned.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    spawned.on('close', () => {
      resolve();
    });
  });
}