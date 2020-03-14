'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const StylelintPlugin = require('stylelint-webpack-plugin');
const config = require('./config');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const resolveModule = relativePath => path.resolve(appDirectory, 'node_modules', relativePath);

const clientConfig = {
    devServer: {
        port: config.PORT || 3000,
        historyApiFallback: true
    },
    devtool: 'eval-source-map',
    entry: ['@babel/polyfill', resolveApp('src/index')],
    output: {
        chunkFilename: 'chunk.[chunkhash:5].js',
        filename: '[name].js',
        publicPath: config.PublicPath || '/'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                        plugins: [
                            ['@babel/plugin-proposal-decorators', {'legacy': true}],
                            ['@babel/plugin-proposal-class-properties', {'loose': true}],
                            ['import', {'libraryName': 'antd', 'style': 'css'}, 'ant'],
                            ['import', {'libraryName': 'antd-mobile', 'style': 'css'}, 'ant-mobile'],
                            ['lodash']
                        ]
                    }
                }]
            },
            {
                test: /\.tsx?$/,
                use: [{
                    loader: 'ts-loader',
                    options: {transpileOnly: true,}
                }]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {limit: 8192}
                }]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                use: [{loader: 'file-loader'}]
            },
            {
                test: /\.css$/,
                exclude: [resolveApp('node_modules'), resolveApp('src/assets')],
                use: [{loader: 'style-loader'},
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                getLocalIdent: getCSSModuleLocalIdent
                            }
                        }
                    }, {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            ident: 'postcss',
                            plugins: [
                                require('postcss-flexbugs-fixes'),
                                require('autoprefixer')({flexbox: 'no-2009'})
                            ]
                        }
                    }]
            },
            {
                test: /\.css$/,
                include: [resolveApp('node_modules'), resolveApp('src/assets')],
                use: [{loader: 'style-loader'}, {loader: 'css-loader'}]
            },
            {
                test: /\.less$/,
                exclude: [resolveApp('node_modules'), resolveApp('src/assets')],
                use: [{loader: 'style-loader'},
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            modules: {
                                getLocalIdent: getCSSModuleLocalIdent
                            }
                        }
                    }, {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            ident: 'postcss',
                            plugins: [
                                require('postcss-flexbugs-fixes'),
                                require('autoprefixer')({flexbox: 'no-2009'})
                            ]
                        }
                    }, {
                        loader: "less-loader",
                        options: {javascriptEnabled: true}
                    }]
            },
            {
                test: /\.less/,
                include: [resolveApp('node_modules'), resolveApp('src/assets')],
                use: [{loader: 'style-loader'}, {loader: 'css-loader'},
                    {
                        loader: "less-loader",
                        options: {javascriptEnabled: true}
                    }]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', '.jsx']
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new HtmlWebpackPlugin({
            template: 'public/index.html'
        }),
        new webpack.DllReferencePlugin({
            context: resolveApp('.dll'),
            manifest: require(resolveApp('dll/vendor-manifest.json'))
        }),
        new HtmlWebpackIncludeAssetsPlugin({assets: ['../dll/vendor.dll.js'], append: false}),
        new StylelintPlugin({configFile: '.stylelintrc', files: '**/*.(c|le)ss', fix: true}),
        new webpack.HotModuleReplacementPlugin(),
        new OpenBrowserPlugin({url: `http://localhost:${config.PORT || 3000}`}),
        new ProgressBarPlugin()
    ],
    node: {
        module: 'empty',
        dgram: 'empty',
        dns: 'mock',
        fs: 'empty',
        http2: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    },
    target: 'web'
};

module.exports = clientConfig;
