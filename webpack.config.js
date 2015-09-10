'use strict';

var webpack = require('webpack'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	path = require('path'),
	ExtractTextPlugin = require("extract-text-webpack-plugin"),
	srcPath = path.join(__dirname, 'src');

module.exports = {
	target: 'web',
	cache: true,
	entry: {
		module: path.join(srcPath, 'module.js'),
		common: ['react', 'react-router', 'alt']
	},
	resolve: {
		root: srcPath,
		extensions: ['', '.js', '.css'],
		modulesDirectories: ['node_modules', 'src']
	},
	output: {
		path: path.join(__dirname, 'tmp'),
		publicPath: '',
		filename: '[name].js',
		library: ['Example', '[name]'],
		pathInfo: true
	},

	module: {
		loaders: [
			{test: /\.js?$/, exclude: /node_modules/, loader: 'babel?cacheDirectory'},
			{test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
			{test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")}
		]
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
		new HtmlWebpackPlugin({
			inject: true,
			template: 'src/index.html'
		}),
		new webpack.NoErrorsPlugin(),
		new ExtractTextPlugin("[name].css")
	],

	debug: true,
	devtool: 'eval-cheap-module-source-map',
	devServer: {
		contentBase: './tmp',
		historyApiFallback: true
	}
};