const http2 = require("http2");

const { TEST_SITE } = require("../../_settings");

const preTest = NRS_SECURE_SESSION.connections.addPathsToWhiteList("tests/blocked/connections/http2WithSecureSession");
if(preTest != false) {

	process.thenTest("NRS_SECURE_SESSION.connections.addProjectPathToWhiteList must be BLOCKED in tests/blocked/http2WithSecureSession!");

} else {

	const client = http2.connect("https://" + TEST_SITE);

	const http2Fn = require("../../functionality/http2Fn");

	const test = http2Fn("block", client);
	if (isReturnProxy(test)) process.thenTest(true);

}