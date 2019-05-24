'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const dll = {
    entry: {
        vendor: ['react', 'react-dom', 'react-redux', 'react-router', 'redux', 'redux-actions']
    },
    output: {
        path: resolveApp('dll'),
        filename: '[name].dll.js',
        library: '[name]_[chunkhash:5]'
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx']
    },
    plugins: [
        new webpack.DllPlugin({
            context: resolveApp( '.dll'),
            path: resolveApp( 'dll/[name]-manifest.json'),
            name: '[name]_[chunkhash:5]'
        }),
        new ProgressBarPlugin()
    ]
};

module.exports = dll;
