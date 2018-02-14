const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
//const webpack = require('webpack');

module.exports = {
    entry: {
        bundle: ['./src/App.jsx'],
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].js',
    },
    devtool: 'cheap-module-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        port: 3333,
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: 'http://localhost:50000',
            },
            '/graphql': {
                target: 'http://localhost:50000',
            },
        },
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            //'material-ui': path.resolve(__dirname, '../material-ui/src/'),
        },
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader', 'less-loader'],
                }),
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader'],
                }),
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader'],
                }),
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: ['url-loader'],
            },
        ],
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'styles.css',
        }),
        //new webpack.optimize.UglifyJsPlugin(),
    ],
};
