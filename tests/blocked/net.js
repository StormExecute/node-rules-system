var net = require("net");

const { TEST_SITE: host} = require("../_settings");
const returnProxy = require("../../src/returnProxy");

const test = net.connect(
	80,
	host,
	function() {
		test.write(`GET / HTTP/1.0
Host: example.com

`);
	}
);

if(test === returnProxy) {

	process.thenTest(true);

} else {

	const callback = require("../functionality/netCallback");

	test.on("data", callback("block"));

}