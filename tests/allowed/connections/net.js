var net = require("net");

const { TEST_SITE: host} = require("../../_settings");

const test = net.connect(
	80,
	host,
	function() {
		test.write(`GET / HTTP/1.0
Host: example.com

`);
	}
);

if(isReturnProxy(test)) {

	process.thenTest("must be allowed!");

} else {

	const callback = require("../../functionality/netCallback");

	test.on("data", callback("allow"));

}