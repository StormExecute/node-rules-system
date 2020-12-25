global.NRS_PATH_SRC = true;
global.NRS_PATH = NRS_PATH_SRC ? "src/index.js" : "lib/NRS.js";

const NRS = require("../" + NRS_PATH);

//node-fetch can be required at this level
const fetch = require("node-fetch");
const nodePath = require("path");

//DONT EXPORT NRS_PASSWORD! USE MATH.RANDOM() AS THE SALT ALWAYS!
const NRS_PASSWORD = "somePassword" + Math.random();

//IF YOU STILL NEED TO EXPORT THE SESSION, USE THIS CONSTRUCTION:
const SECURE_NRS_SESSION = NRS.secureSession(NRS_PASSWORD, "examples/secondUsageExample.js");
SECURE_NRS_SESSION.startRecordLogs();

SECURE_NRS_SESSION.enableFullSecure();

SECURE_NRS_SESSION.connections.addDependencyAndPathsToWhiteList(
	["node-fetch", "examples/secondUsageExample.js"]
);

const URL = "http://www.example.com";

const cwd = (() => {

	const _ = process.cwd();

	if(_.endsWith("/examples")) return _;

	return nodePath.join(_, "./examples");

})();

fetch(URL)
	.then(res => res.text())
	.then(body => {

		console.log("DONE!", SECURE_NRS_SESSION.getAllLogs());

	});

const thisLogs = SECURE_NRS_SESSION.getAllLogs();

// -2 because the real last log is callFromSecureSession
const lastLog = thisLogs[thisLogs.length - 2];

if (
	lastLog.type == "callFn"
	&&
	lastLog.callerPaths[0] == nodePath.join(
		cwd,
		"../node_modules/node-fetch/lib/index.js"
	)
	&&
	lastLog.callerPaths[ lastLog.callerPaths.length - 1 ] == nodePath.join(
		cwd,
		"./secondUsageExample.js"
	)
) {

	if(lastLog.grantRights == false) {

		throw "must be allowed!";

	}

} else {

	throw "something went wrong!";

}