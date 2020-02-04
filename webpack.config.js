const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const ENV = process.env.ENV || 'development';

module.exports = {
    mode: ENV,
    devtool: 'inline-source-map',
    entry: './src/index.ts',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        alias: {
            img: path.resolve(__dirname, 'src/img')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: 'head'
        }),
        new HtmlWebpackInlineSVGPlugin({
            runPreEmit: true
        }),
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'async'
        })
    ],
    module: {
        rules: [{
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: '/node_modules'
        }, {
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: "postcss-loader",
                    options: {
                        plugins: () => ([
                            require("autoprefixer"),
                        ]),
                    },
                },
                'sass-loader'
            ]
        }, {
            test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
            use: 'file-loader'
        }]
    }
};
