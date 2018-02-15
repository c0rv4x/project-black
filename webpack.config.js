var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve('public/static');
var APP_DIR = path.resolve('app');

var config = {
    // watchOptions: {
    //     poll: true
    // },
	entry: APP_DIR + '/index.jsx',
	module : {
		loaders : [{
			test : /\.jsx?/,
			include : APP_DIR,
			loader : 'babel-loader'
		},
		{ test: /\.css$/, loader: 'style-loader!css-loader' }]
	},
	output: {
		path: BUILD_DIR,
		filename: 'bundle.js'
	}
};

module.exports = config;