const modoDev = process.env.NODE_ENV;
const webpack = require('webpack');
const path = require('path');

const node_dir = __dirname + '/node_modules';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AsyncChunkNames = require('webpack-async-chunk-names-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');

require('dotenv').config({  
    path: "./../.env"
});

module.exports = {
    mode: 'development',
    entry: {
        client: "./src/index.jsx",
        vendor: ['react', 'react-dom', 'redux','highcharts'],
    },
    devtool: 'eval-source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js',
        chunkFilename: '[name].[contenthash].js',
        publicPath: '/',
    },
    devServer: {
        disableHostCheck: true,
        port: 8081,
        contentBase: path.resolve(__dirname, 'dist'),
        // https: true,
        // port: 443,// ssl d
        // host: '192.168.173.162', // you can change this ip with your ip
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
        alias: {
            app: path.resolve(__dirname, './src'),
            modules: __dirname + '/node_modules',
            asset:  path.resolve(__dirname, './assets'),
            jquery: node_dir + '/jquery/dist/jquery.min.js'
        }
    },
    plugins: [ 
        new webpack.ProvidePlugin({
            '$': "jquery",
            'window.jQuery': "jquery",
            'jQuery': 'jquery',
            'window.$': 'jquery',
        }),
        new MiniCssExtractPlugin({
            filename: 'app.css'
        }),
        new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, './public/index.html')
        }),
        new AsyncChunkNames(),
        new CopyPlugin([
            { from: 'public/images', to: 'images' },
            { from: 'public/manifest.json', to: 'manifest.json' },
            { from: 'public/meta.json', to: 'meta.json' },
            { from: 'public/firebase-messaging-sw.js', to: 'firebase-messaging-sw.js' },
            { from: 'public/service-worker.js', to: 'service-worker.js' },
        ]),
        new Dotenv({
            path: './../.env', // load this now instead of the ones in '.env'
            safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
            systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
            silent: true, // hide any errors
            defaults: false // load '.env.defaults' as the default values if empty.
        })
    ],
    // optimization
    optimization: {
        moduleIds: 'hashed',
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                default: false,
                vendors: false,

                // vendor chunk
                vendor: {
                    // name of the chunk
                    name: 'vendor',

                    // async + async chunks
                    chunks: 'all',

                    // import file path containing node_modules
                    test: /node_modules/,

                    // priority
                    priority: 20
                },

                // common chunk
                common: {
                    name: 'common',
                    minChunks: 2,
                    chunks: 'all',
                    priority: 10,
                    reuseExistingChunk: true,
                    enforce: true
                }
            }
        }
    },
    module: {
        rules: [
        {
            test: /.js[x]?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets:  [
                    "@babel/preset-env", "@babel/react"
                ],
                "plugins": [
                    "@babel/plugin-transform-runtime",
                    "@babel/plugin-proposal-object-rest-spread",
                    "@babel/plugin-syntax-dynamic-import",
                    "@babel/plugin-proposal-class-properties"
                ]
            }
        },{
            test: /\.css|.scss$/,
            use:[
                MiniCssExtractPlugin.loader,
                'css-loader',
                'sass-loader'
            ]
        }, {
            test: /\.(png|woff|woff2|eot|otf|ttf|svg)$/,
            loader:[ 'file-loader' ]
        }]
    }
}
