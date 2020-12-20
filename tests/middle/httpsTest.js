const https = require("https");

const { TEST_SITE: host } = require("../_settings");

const options = { host, port: 443, method: "GET" };

const test = function(callback) {

	const _test = https.request(options, function (res) {

		res.on('data', () => {});

		res.on('end', function () {

			callback("allow");

		});

	}).end();

	if(isReturnProxy(_test)) return callback("block")

}

module.exports = test;