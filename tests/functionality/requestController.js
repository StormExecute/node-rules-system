const request = require("request");
const nodePath = require("path");

const { TEST_SITE: host, NRS_PASSWORD } = require("../_settings");

const NRS_SESSION = require("../../" + NRS_PATH).session(NRS_PASSWORD);

module.exports = function Request(should, callback) {

	let then = false;

	request.get("http://" + host, function () {

		if(then == true) return;

		then = true;

		callback();

	});

	setImmediate(function () {

		const lastLog = NRS_SESSION.getAllLogs().pop();

		console.log(lastLog);

		if (
			lastLog.type == "callFn"
			&&
			lastLog.callerPaths[0] == nodePath.join(__dirname, "../../node_modules/request/request.js")
		) {

			if(should == "allow" && lastLog.grantRights == false) {

				process.thenTest("must be allowed!");

			} else if(should == "block" && lastLog.grantRights == false) {

				process.thenTest(true);

			}

		} else if(then == false) {

			then = true;

			process.thenTest("something went wrong!");

		}

	});

}