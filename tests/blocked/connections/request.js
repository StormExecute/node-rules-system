const request = require("request");
const nodePath = require("path");

const { NRS_PASSWORD } = require("../../_settings");
const returnProxy = require("../../../src/returnProxy");

const NRS_SESSION = require("../../../src/index").session(NRS_PASSWORD);

let then = false;

request.get("http://localhost:3000", function () {

	if(then == true) return;

	then = true;

	process.thenTest("must be blocked!");

});

setImmediate(function () {

	const lastLog = NRS_SESSION.getAllLogs().pop();

	if (
		lastLog.type == "callFn"
		&&
		lastLog.nativePath == nodePath.join(__dirname, "../../../node_modules/request/request.js")
		&&
		lastLog.wrapPath == __filename
	) {

		if(lastLog.grantRights == false) {

			process.thenTest(true);

		}

	} else if(then == false) {

		then = true;

		process.thenTest("something went wrong!");

	}

});