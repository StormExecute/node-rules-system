const fetch = require('node-fetch');
const nodePath = require("path");

const { TEST_SITE, NRS_PASSWORD } = require("../../_settings");
const returnProxy = require("../../../src/returnProxy");

const NRS_SESSION = require("../../../src/index").session(NRS_PASSWORD);

let then = false;

fetch("http://" + TEST_SITE).then(res => {

	if(then == true) return;

	then = true;

	process.thenTest(true);

});

const lastLog = NRS_SESSION.getAllLogs().pop();

if (
	lastLog.type == "callFn"
	&&
	lastLog.nativePath == nodePath.join(__dirname, "../../../node_modules/node-fetch/lib/index.js")
	&&
	lastLog.wrapPath == __filename
) {

	if(lastLog.grantRights == false) {

		process.thenTest("must be allowed!");

	}

} else if(then == false) {

	then = true;

	process.thenTest("something went wrong!");

}