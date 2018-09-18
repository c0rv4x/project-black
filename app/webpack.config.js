const webpack = require('webpack');
const path = require('path');

const APP_DIR = path.resolve('.');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const config = {
	entry: APP_DIR + '/src/index.jsx',
	devtool: '#eval-source-map',
	devServer: {
		contentBase: path.join(__dirname, '..', "public"),
		// compress: true,
		port: 9000
	},
	plugins: [
		// new CleanWebpackPlugin(['public']),
		new HTMLWebpackPlugin({"template": `${__dirname}/src/index.html`})
	],
	module : {
		loaders : [
			{
				test : /\.jsx?/,
				include : APP_DIR,
				loader : 'babel-loader'
			},
			{ test: /\.css$/, loader: 'style-loader!css-loader' },
			{
				test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
				loader: require.resolve('file-loader'),
			},
			{
				test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
				loader: require.resolve('url-loader')
			}			
		]
	},
	output: {
		path: path.resolve(__dirname, '..', 'public'),
		publicPath: '/',
		filename: 'bundle.js'
	}
};

module.exports = config;