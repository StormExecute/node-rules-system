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

};

module.exports = webpackOptions;