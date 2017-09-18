const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const exclusions = /node_modules/i;

let nodeModules = {};

fs.readdirSync("node_modules").filter((x)=>{
	return [".bin"].indexOf(x) === -1;
}).forEach((mod)=>{
	nodeModules[mod] = "commonjs " + mod;
});

const nodeTarget = {
	entry: "./server.js",
	target: "node",
	externals: nodeModules,
	node: {
		__dirname: false,
		__filename: false
	},
	output: {
		filename: "server.js",
		path: path.resolve(__dirname, "dist"),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: exclusions,
				use: "babel-loader"
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin("./dist")
	]
};

const webTarget = {
	entry: "./src/index.js",
	target: "web",
	output: {
		filename: "js/index.[hash:8].js",
		path: path.resolve(__dirname, "dist"),
		publicPath: "/"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: "babel-loader"
			},
			{
				test: /\.scss$/,
				exclude: exclusions,
				use: ExtractTextPlugin.extract({
					use: ["css-loader", "postcss-loader", "sass-loader"]
				})
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "src/html/index.html",
			inject: true,
			hash: false,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				minifyJS: true
			}
		}),
		new ExtractTextPlugin("css/styles.[hash:8].css")
	]
}

module.exports = [nodeTarget, webTarget];
