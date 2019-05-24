#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const spawn = require('cross-spawn');
const version = require('../package').version;

program
    .version(version, '-v, --version')
    .option('dll', 'Builds the dll for development')
    .option('start', 'Runs the app in development mode')
    .option('build', 'Builds the app for production');

program.parse(process.argv);

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
