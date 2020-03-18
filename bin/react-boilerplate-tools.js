#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs-extra');
const jsonFormat = require('json-format');
const path = require('path');
const program = require('commander');
const spawn = require('cross-spawn');
const version = require('../package').version;

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

program
    .version(version, '-v, --version')
    .option('-i --init', 'Initialize project directory')
    .option('-d --dll', 'Builds the dll for development')
    .option('-s --start', 'Runs the app in development mode')
    .option('-b --build', 'Builds the app for production');

program.parse(process.argv);

if (program.init) {
    console.info(chalk.green('Initialize project directory'));
    const package = fs.readJsonSync(resolveApp('package.json'));
    package.scripts['init'] = "react-boilerplate-tools --init";
    package.scripts['dll'] = "react-boilerplate-tools --dll";
    package.scripts['start'] = "react-boilerplate-tools --start";
    package.scripts['build'] = "react-boilerplate-tools --build";
    fs.writeFileSync(resolveApp('package.json'), jsonFormat(package));
    fs.copySync(path.join(__dirname + '/../template'), appDirectory);
}

if (program.dll) {
    const script = 'webpack.dll.config';
    console.info(chalk.blue('Builds the dll for development'));
    spawn('cross-env', ['NODE_ENV=development', 'webpack', '--config', path.join(__dirname + '/../scripts/' + script)], {stdio: 'inherit'});
}

if (program.start) {
    const script = 'webpack.dev.config';
    console.info(chalk.blue('Runs the app in development mode'));
    spawn('cross-env', ['NODE_ENV=development', 'webpack-dev-server', '--config', path.join(__dirname + '/../scripts/' + script)], {stdio: 'inherit'});
}

if (program.build) {
    const script = 'webpack.prod.config';
    console.info(chalk.blue('Builds the app for production'));
    spawn('cross-env', ['NODE_ENV=production', 'webpack', '--config', path.join(__dirname + '/../scripts/' + script)], {stdio: 'inherit'});
}
