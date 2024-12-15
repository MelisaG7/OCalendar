const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require("webpack");



module.exports = {
    mode: 'none', //Can also be development or production https://webpack.js.org/configuration/mode/
    entry: {
        app: './src/index.tsx',
    },

    output: {
        filename: 'main.js',
        publicPath: "",
        path: path.resolve(__dirname, '../wwwroot/js')
    },

    resolve: {
        extensions: ["*", ".ts", ".tsx", ".js", ".jsx", ".CSS"]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },

            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {},
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            }

        ]
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'), // Path to public assets
        },
        compress: true,
        port: 8080, // Ensure this matches your localhost port
        historyApiFallback: true, // Enables client-side routing
        open: true, // Opens the app in the browser
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(['../wwwroot/js']),
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ]

};