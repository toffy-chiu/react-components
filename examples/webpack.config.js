var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path=require('path');

// 生产环境
var isProd = process.env.NODE_ENV === 'production';
// 开发环境下资源文件路径
var devSrc='devsrc/';

module.exports = {
    entry: {
        app: isProd?[
            './examples/js/app'
        ]:[
            'webpack-dev-server/client?http://0.0.0.0:3006',
            'webpack/hot/only-dev-server',
            './examples/js/app'
        ],
        vendor:[
            'react',
            'react-dom',
            'react-router'
        ]
    },
    output: {
        publicPath:isProd ? './' : '/', //给require.ensure用；webpack-dev-server的网站名
        path: path.resolve(__dirname, './dist'), //js的发布路径
        filename: isProd ? '[name].[chunkhash:8].js' : (devSrc+'[name].js'),
        chunkFilename:isProd ? '[name].chunk.[chunkhash:8].js' : (devSrc+'[name].chunk.js')
    },
    resolve: {
        extensions: ['', '.js']
    },
    module: {
        loaders: [
            {test: /\.(otf|eot|svg|ttf|woff|woff2)\??.*$/, loader:'url?limit=50000&name='+(isProd?'':devSrc)+'[hash:8].[ext]'},
            {test: /\.css$/, loaders:['style', 'css']},
            {test: /\.js$/, loader: 'react-hot/webpack!jsx?harmony', include:[path.join(__dirname, 'js'),path.join(__dirname, '../src')]},
            {test: /\.(png|jpe?g|gif)$/,loader: 'url?limit=8192&name='+(isProd?'':devSrc)+'[hash:8].[ext]' }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin('vendor', (isProd?'':devSrc)+'vendor.js'),
        new ExtractTextPlugin(isProd ? '[name].[chunkhash:8].css' : devSrc+'[name].css'),
        new HtmlWebpackPlugin({
            title:'React常用组件示例',
            template:'./examples/index.html',
            //filename:'./examples/index.html' //结合output.path
        }),
        new webpack.ProvidePlugin({
            React:'react'
        })
    ]
};