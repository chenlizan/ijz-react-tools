'use strict';

const fs = require('fs');
const isWsl = require('is-wsl');
const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const resolveModule = relativePath => path.resolve(appDirectory, 'node_modules', relativePath);

const clientConfig = {
    mode: 'production',
    entry: {
        client: [resolveApp('src/index')],
        vendor: ['babel-polyfill', 'react', 'react-dom', 'react-redux', 'react-router-dom', 'redux', 'redux-actions']
    },
    output: {
        path: resolveApp('dist'),
        chunkFilename: 'chunk.[chunkhash:5].js',
        filename: '[name].js',
        publicPath: './'
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        ecma: 8,
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        comparisons: false,
                        inline: 2,
                    },
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        ecma: 5,
                        comments: false,
                        ascii_only: true,
                    },
                },
                parallel: !isWsl,
                cache: true,
                sourceMap: false,
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    parser: safePostCssParser
                },
            }),
        ],
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: true,
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
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: (resourcePath, context) => {
                            return path.relative(path.dirname(resourcePath), context) + '../../';
                        }
                    }
                }, {
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
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: (resourcePath, context) => {
                            return path.relative(path.dirname(resourcePath), context) + '../../';
                        }
                    }
                }, {
                    loader: 'css-loader'
                }]
            },
            {
                test: /\.less$/,
                exclude: [resolveApp('node_modules'), resolveApp('src/assets')],
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: (resourcePath, context) => {
                            return path.relative(path.dirname(resourcePath), context) + '../../';
                        }
                    }
                }, {
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
                    loader: 'less-loader',
                    options: {javascriptEnabled: true}
                }]
            },
            {
                test: /\.less/,
                include: [resolveApp('node_modules'), resolveApp('src/assets')],
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: (resourcePath, context) => {
                            return path.relative(path.dirname(resourcePath), context) + '../../';
                        }
                    }
                }, {
                    loader: 'css-loader'
                }, {
                    loader: 'less-loader',
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
            'process.env': {NODE_ENV: JSON.stringify('production')}
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'public/index.html',
            minify: false
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].css',
            chunkFilename: 'static/css/[name].[chunkhash:5].chunk.css'
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        }),
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
