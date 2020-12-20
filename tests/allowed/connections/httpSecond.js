const http = require("http");

const { TEST_SITE: host} = require("../../_settings");

const options = { host };
const callback = require("../../functionality/httpCallback");

module.exports = function () {

	const test = http.request(options, callback("allow")).end();
	if (isReturnProxy(test)) process.thenTest("must be allowed!");

}