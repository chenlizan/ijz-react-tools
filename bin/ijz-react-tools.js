#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const spawn = require('cross-spawn');
const version = require('../package').version;

program
    .version(version, '-v, --version')
    .option('dll', 'build dll')
    .option('dev', 'dev')
    .option('prod', 'prod');


program.parse(process.argv);

if (program.dll) {
    console.info('start building dll');
    const script = 'webpack.dll.config';
    spawn('cross-env', ['NODE_ENV=development', 'webpack', '--config', path.join(__dirname + '/../scripts/' + script)], {stdio: 'inherit'});
}

if (program.dev) {
    console.info('start building dll');
    const script = 'webpack.dll.config';
    spawn('cross-env', ['NODE_ENV=development', 'webpack-dev-server', '--config', path.join(__dirname + '/../scripts/' + script)], {stdio: 'inherit'});
}

if (program.prod) {
    console.info('start building dll');
    const script = 'webpack.prod.config';
    spawn('cross-env', ['NODE_ENV=production', 'webpack', '--config', path.join(__dirname + '/../scripts/' + script)], {stdio: 'inherit'});
}