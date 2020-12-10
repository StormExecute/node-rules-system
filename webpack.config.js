const TerserPlugin = require('terser-webpack-plugin');

const nodePath = require("path");

const webpackOptions = {

	entry: "./src",

	output: {

		path: nodePath.join(process.cwd(), "lib"),
		filename: "NRS.js",
		libraryTarget: "commonjs",

	},

	target: 'node',

	externals: {

		"_http_agent": "_http_agent",
		"_http_client": "_http_client",
		"_tls_wrap": "_tls_wrap",

	},

	optimization: {

		minimize: true,

		minimizer: [

			new TerserPlugin({

				terserOptions: {

					format: {

						comments: function (_, { value }) {

							if(value.match(/NODE-RULES-SYSTEM-SIGNATURE/)) return true;

							return false;

						},

					},

				},

			}),

		],

	},

};

module.exports = webpackOptions;