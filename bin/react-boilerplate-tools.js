#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs-extra')
const path = require('path');
const program = require('commander');
const spawn = require('cross-spawn');
const version = require('../package').version;

program
    .version(version, '-v, --version')
    .option('-i --init', 'Initialize project directory')
    .option('-d --dll', 'Builds the dll for development')
    .option('-s --start', 'Runs the app in development mode')
    .option('-b --build', 'Builds the app for production');

program.parse(process.argv);

if (program.init) {
    console.info(chalk.green('Initialize project directory'));
    fs.copySync(path.join(__dirname + '/../template'), fs.realpathSync(process.cwd()));
}

if (program.dll) {
    const script = 'webpack.dll.config';
    console.info('Builds the dll for development');
    spawn('cross-env', ['NODE_ENV=development', 'webpack', '--config', path.join(__dirname + '/../scripts/' + script)], {stdio: 'inherit'});
}

if (program.start) {
    const script = 'webpack.dev.config';
    console.info('Runs the app in development mode');
    spawn('cross-env', ['NODE_ENV=development', 'webpack-dev-server', '--config', path.join(__dirname + '/../scripts/' + script)], {stdio: 'inherit'});
}

if (program.build) {
    const script = 'webpack.prod.config';
    console.info('Builds the app for production');
    spawn('cross-env', ['NODE_ENV=production', 'webpack', '--config', path.join(__dirname + '/../scripts/' + script)], {stdio: 'inherit'});
}
