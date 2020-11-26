const request = require("request");
const nodePath = require("path");

const { NRS_PASSWORD } = require("../../_settings");

const NRS_SESSION = require("../../../" + NRS_PATH).session(NRS_PASSWORD);

let then = false;

request.get("http://localhost:3000", function () {

	if(then == true) return;

	then = true;

	process.thenTest(true);

});

setImmediate(function () {

	const lastLog = NRS_SESSION.getAllLogs().pop();

	if (
		lastLog.type == "callFn"
		&&
		lastLog.callerPaths[0] == nodePath.join(__dirname, "../../../node_modules/request/request.js")
		&&
		lastLog.callerPaths.last() == __filename
	) {

		if(lastLog.grantRights == false) {

			process.thenTest("must be allowed!");

		}

	} else if(then == false) {

		then = true;

		process.thenTest("something went wrong!");

	}

});