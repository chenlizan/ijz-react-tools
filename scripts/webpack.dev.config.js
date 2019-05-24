'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const PORT = 3000;

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const resolveModule = relativePath => path.resolve(appDirectory, 'node_modules/', relativePath);

const clientConfig = {
    devServer: {
        port: PORT,
        historyApiFallback: true
    },
    devtool: 'eval-source-map',
    entry: ['babel-polyfill', resolveApp('src/index')],
    output: {
        chunkFilename: 'chunk.[chunkhash:5].js',
        filename: '[name].js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                use: [{
                    loader: 'file-loader',
                }]
            },
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'es2015', 'react', 'stage-0'],
                        plugins: [
                            ['import', [
                                {'libraryName': 'antd', 'style': 'css'},
                                {'libraryName': 'antd-mobile', 'style': 'css'}
                            ]], 'lodash', 'transform-decorators-legacy'
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                exclude: [resolveApp('node_modules'), resolveApp('src/assets')],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: true,
                            namedExport: true,
                            localIdentName: '[path][name]__[local]--[hash:base64:5]'
                        }
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [
                                require('postcss-flexbugs-fixes'),
                                require('autoprefixer')({flexbox: 'no-2009'})
                            ]
                        }
                    }]
                })
            },
            {
                test: /\.css$/,
                include: [resolveApp('node_modules'), resolveApp('src/assets')],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader']
                })
            },
            {
                test: /\.less$/,
                exclude: [resolveApp('node_modules'), resolveApp('src/assets')],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: true,
                            namedExport: true,
                            localIdentName: '[path][name]__[local]--[hash:base64:5]'
                        }
                    }, {
                        loader: 'postcss-loader',
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
                })
            },
            {
                test: /\.less/,
                include: [resolveApp('node_modules'), resolveApp('src/assets')],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', {
                        loader: "less-loader",
                        options: {javascriptEnabled: true}
                    }]
                })
            }
        ]
    },
    resolve: {
        alias: {
            "yylib-ui": resolveModule('yylib-quick-mobile/dist'), //组件库
            "yylib-utils": resolveModule('yylib-quick-mobile/dist/utils'), //工具库
            "yylib-handler": resolveModule('yylib-quick-mobile/dist/crud/handler'), //组件库提供的模板代码
            'pub-styles': resolveModule('ijz-mobile/dist/styles/index.less'), //i建造模板公共样式文件
            'ijz-mobile': resolveModule('ijz-mobile/dist'), //i建造模板代码
            'ijz-mobile/utils': resolveModule('ijz-mobile/dist/utils'), //i建造模板工具
            'YYCreatePage': resolveModule('yylib-quick-mobile/dist/yylib/quickdev/YYCreatePage.js') // 设计器页面
        },
        extensions: ['.js', '.json', '.jsx']
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {NODE_ENV: JSON.stringify('development')}
        }),
        new webpack.DllReferencePlugin({
            context: resolveApp('.dll'),
            manifest: require(resolveApp('dll/vendor-manifest.json'))
        }),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('[name].[contenthash:5].css'),
        new HtmlWebpackPlugin({
            favicon: 'public/favicon.ico',
            template: 'public/index.html'
        }),
        new HtmlWebpackIncludeAssetsPlugin({assets: ['../dll/vendor.dll.js'], append: false}),
        new OpenBrowserPlugin({url: `http://localhost:${PORT}`, browser: 'chrome'}),
        new ProgressBarPlugin()
    ],
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    },
    target: 'web'
};

module.exports = clientConfig;
