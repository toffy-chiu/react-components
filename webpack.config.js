var webpack = require('webpack');
var path=require('path');

module.exports = {
    entry: {
        index: [
            'webpack-dev-server/client?http://192.168.1.109:3000',
            'webpack/hot/only-dev-server',
            './components/index'
        ]
    },
    output: {
        publicPath:'/',
        path: path.join(__dirname, 'js'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {test: /\.jsx?$/, loader: 'react-hot/webpack!jsx?harmony', exclude:/node_modules/}
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('common.js'),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
};