const http2 = require("http2");

const { TEST_SITE } = require("../../_settings");

const preTest = NRS_SECURE_SESSION.connections.addPathsToWhiteList("tests/allowed/connections/http2WithSecureSession");
if(preTest == false) {

	process.thenTest("NRS_SECURE_SESSION.connections.addProjectPathToWhiteList must be ALLOWED in tests/allowed/http2WithSecureSession!");

} else {

	const client = http2.connect("https://" + TEST_SITE);

	const http2Fn = require("../../functionality/http2Fn");

	const test = http2Fn("allow", client);
	if (isReturnProxy(test)) process.thenTest("must be allowed!");

}