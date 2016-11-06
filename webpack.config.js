var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path=require('path');

// 生产环境
var isProd = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        index: [
            'webpack-dev-server/client?http://0.0.0.0:3000',
            'webpack/hot/only-dev-server',
            './index'
        ]
    },
    output: {
        publicPath:'/',
        path: path.resolve(__dirname, './dist'), //js的发布路径
        filename: '[name].js',
        chunkFilename:'[name].chunk.js'
    },
    resolve: {
        extensions: ['', '.js']
    },
    module: {
        loaders: [
            {test: /\.js$/, loader: 'react-hot/webpack!jsx?harmony', exclude:/node_modules/},
            {test: /\.css$/, loaders: ['style', 'css'], include:path.join(__dirname, './lib/css')}
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(isProd?"production":"dev")
            }
        }),
        new webpack.ProvidePlugin({
            React:'react'
        }),
        new webpack.optimize.CommonsChunkPlugin('common.js'),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new HtmlWebpackPlugin({
            title:'React Components',
            template:'./index.html',
            filename:'./index.html' //结合output.path
        })
    ]
};