const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	mode: 'production',
	optimization: {
		minimize: false,
		nodeEnv: false,
	},
	entry: {
		'server': './src/server.ts',
	},
	devtool: 'source-map',
	resolve: {
		extensions: ['.wasm', '.mjs', '.js', '.jsx', '.json', '.ts', '.tsx'],
	},
	output: {
		libraryTarget: 'umd',
		path: path.join(__dirname, 'dist'),
		filename: '[name].js',
	},
	target: 'node',
	externals: [nodeExternals()],
	node: {
		__dirname: 'mock',
	},
	module: {
		rules: [
			{ test: /\.tsx?$/, loader: 'ts-loader' },
		],
	}
};
