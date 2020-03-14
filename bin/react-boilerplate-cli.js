#!/usr/bin/env node

const chalk = require('chalk');
const path = require('path');
const program = require('commander');
const spawn = require('cross-spawn');
const version = require('../package').version;

let projectName;

program
    .version(version, '-v, --version')
    .usage(`${chalk.green('<project-directory>')}`)
    .action(({args}) => {
        if (args.length) {
            projectName = args[0];
        }
    })
    .option('-d --dll', 'Builds the dll for development')
    .option('-s --start', 'Runs the app in development mode')
    .option('-b --build', 'Builds the app for production');

program.parse(process.argv);

if (typeof projectName !== 'undefined') {
    console.log(
        `${chalk.cyan(program.name())} ${chalk.green(projectName)}`
    );
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
