const webpack = require("webpack");

const TerserPlugin = require("terser-webpack-plugin");

const nodePath = require("path");
const fs = require("fs");

const webpackOptions = {

	mode: "production",

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

if( process.argv[1].endsWith( "webpack-cli" ) ) {

	module.exports = webpackOptions;

} else {

	webpack(webpackOptions, (err, stats) => {

		if (!err) err = stats.toJson().errors[0];

		if (err) {

			throw new Error(err);

		}

		console.log(stats.toString({colors: true}));

		const content = fs.readFileSync( nodePath.join(process.cwd(), "lib/NRS.js") ).toString();

		const NRS_PRIMORDIALS = `let a=require("http")["NRS_PRIMORDIALS"];`;
		const FREEZE = `a.ObjectFreeze(e[n]);a.ObjectDefineProperty(t,n,{enumerable:!0,value:e[n]})`;

		const finalContent = content.replace(
			/!function\(t,e\){for\(var n in e\)t\[n\]=e\[n\];/,
			`!function(t,e){${NRS_PRIMORDIALS}for(var n in e){${FREEZE}}`
		);

		fs.writeFile( nodePath.join(process.cwd(), "lib/NRS.js"), finalContent, err => {

			if(err) {

				throw new Error(err);

			}

			console.log("DONE!");
			process.exit(0);

		});

	});

}