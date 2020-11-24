const NRS = require("../lib/NRS");

global.isReturnProxy = NRS.isReturnProxy;

const {

	NRS_PASSWORD,

	MAX_WAIT_INTERVAL_BEFORE_THROW,

	MAX_WAIT_INTERVAL_BEFORE_NEXT_CONNECTION_TEST: waitBeforeNextConnection,
	MAX_WAIT_INTERVAL_BEFORE_NEXT_FS_TEST: waitBeforeNextFs,
	MAX_WAIT_INTERVAL_BEFORE_NEXT_OTHER_TEST: waitBeforeNextOther,

	BLOCK_CONSOLE_LOG_DASH_REPEATS: repeats,

} = require("./_settings");

NRS.init(NRS_PASSWORD);

NRS.connections.block(NRS_PASSWORD);
NRS.fs.block(NRS_PASSWORD);
NRS.fs.allow(NRS_PASSWORD);
NRS.fs.block(NRS_PASSWORD);

const FAST_NRS_SESSION = NRS.session(NRS_PASSWORD);

NRS.setSecure(NRS_PASSWORD, "enable", [
	"child_process", "dgram", "worker_threads", "cluster", "timers"
]);

FAST_NRS_SESSION.startRecordLogs();

const clearFsTempBeforeRun = require("./clearFsTempBeforeRun");
const $unlinkSync = NRS.fs.$fs.get(NRS_PASSWORD, "unlinkSync");
const $rmdirSync = NRS.fs.$fs.get(NRS_PASSWORD, "rmdirSync");
clearFsTempBeforeRun($unlinkSync, $rmdirSync);

const mustStayFile = require("./mustStayFile");
const $writeFileSync = NRS.fs.$fs.get(NRS_PASSWORD, "writeFileSync");
mustStayFile($writeFileSync);

const NRS_SESSION = NRS.session(NRS_PASSWORD);

const runOnlyConnectionTests = !!process.argv.filter(el => el == "-c" || el == "--connections").length || process.env.debugP;
const runOnlyFsTests = !!process.argv.filter(el => el == "-s" || el == "--fs").length || process.env.debugP;
const runOnlyOtherTests = !!process.argv.filter(el => el == "-o" || el == "--others").length || process.env.debugP;

const bConn = filename => "./blocked/connections/" + filename;
const bFs = filename => "./blocked/fs/" + filename;
const bFPs = filename => "./blocked/fs/promises/" + filename;
const bOth = filename => "./blocked/others/" + filename;

const aConn = filename => "./allowed/connections/" + filename;
const aFs = filename => "./allowed/fs/" + filename;
const aFPs = filename => "./allowed/fs/promises/" + filename;
const aOth = filename => "./allowed/others/" + filename;

const needProcessVersion = require("../dependencies/needProcessVersion");

const bFPsV = filename => ~needProcessVersion("10.0.0") ? bFPs(filename) : () => {};
const aFPsV = filename => ~needProcessVersion("10.0.0") ? aFPs(filename) : () => {};

require("express")()
	.get("/", (req, res) => res.send("hello"))
	.listen(3000);

global.Array.prototype.last = function() {

	return this[this.length - 1];

}

const connectionTests = [

	() => blockLogDash("Connection Tests started"),

	() => NRS.connections.addPathsToWhiteList(NRS_PASSWORD, "tests/allowed/connections/http.js"),

	bConn("http"),
	aConn("http"),

	waitBeforeNextConnection,

	() => NRS.connections.addPathsToWhiteList(
		NRS_PASSWORD,
		["tests/allowed/connections/httpSecond", "tests/index.js"],
		["tests/blocked/connections/httpFullBlocked_allowed.js"]
	),

	bConn("httpSecond"),
	aConn("httpSecond"),

	waitBeforeNextConnection,

	"./middle/httpByNRSGet",

	waitBeforeNextConnection,

	() => {

		NRS.connections.allow(NRS_PASSWORD);
		NRS.connections.block(NRS_PASSWORD, "fullBlock" || true);

	},

	bConn("httpFullBlocked_blocked"),
	bConn("httpFullBlocked_allowed"),

	() => {

		NRS.connections.allow(NRS_PASSWORD);

	},

	aConn("httpAllowByRestore"),

	waitBeforeNextConnection,

	() => {

		NRS.connections.block(NRS_PASSWORD, false);
		NRS.connections.addPathsToWhiteList(NRS_PASSWORD, ["tests/middle/httpsTest", "tests/allowed/connections/https.js"])

	},

	bConn("https"),
	aConn("https"),

	waitBeforeNextConnection,

	() => {

		NRS_SESSION.connections.allow();

		delete require.cache[require.resolve("./allowed/connections/httpAllowByRestore")];

	},

	aConn("httpAllowByRestore"),

	waitBeforeNextConnection,

	() => {

		NRS_SESSION.connections.block(true);

		delete require.cache[require.resolve("./blocked/connections/httpFullBlocked_allowed")];

	},

	bConn("httpFullBlocked_allowed"),

	() => {

		NRS_SESSION.connections.allow();
		NRS_SESSION.connections.block();

		delete require.cache[require.resolve("./blocked/connections/httpFullBlocked_blocked")];

	},

	bConn("httpFullBlocked_blocked"),

	//to slow down the fast pace
	waitBeforeNextConnection,

	() => NRS_SESSION.connections.addPathsToWhiteList("tests/allowed/connections/net.js"),

	bConn("net"),
	aConn("net"),

	waitBeforeNextConnection,

	() => {

		global.NRS_SECURE_SESSION = NRS.secureSession(NRS_PASSWORD, [
			"tests/allowed/connections/http2WithSecureSession"
		]);

	},

	bConn("http2WithSecureSession"),
	aConn("http2WithSecureSession"),

	waitBeforeNextConnection,

	() => FAST_NRS_SESSION.connections.addDependencyAndPathsToWhiteList(

		["$test/allowed", "tests/index.js"],
		["node_modules/$test/allowed", "tests/allowed/connections/httpDependency-Project.js"],
		["node_modules/node-fetch", "tests/allowed/connections/node-fetch.js"],
		["node_modules/request", "tests/allowed/connections/request.js"],

	),

	bConn("node-fetch"),
	aConn("node-fetch"),

	waitBeforeNextConnection,

	bConn("request"),
	aConn("request"),

	waitBeforeNextConnection,

	"$test/blocked/httpInDependency",
	"$test/allowed/httpInDependency",

	waitBeforeNextConnection,

	bConn("httpDependency-Project"),
	aConn("httpDependency-Project"),

];

const fsTests = [

	() => {

		NRS.fs.addPathsToWhiteList(NRS_PASSWORD, "tests/allowed/fs/fsWriteSimple.js");

		blockLogDash("FS Tests started");

	},

	bFs("fsWriteSimple"),
	aFs("fsWriteSimple"),

	waitBeforeNextFs,

	() => NRS.fs.addPathsToWhiteList(NRS_PASSWORD,
		["tests/allowed/fs/appendFile.js"],
		["tests/allowed/fs/copyFile.js"],
		["tests/allowed/fs/createWriteStream.js"],
		["tests/allowed/fs/ftruncate.js"],
	),

	bFs("appendFile"),
	aFs("appendFile"),

	waitBeforeNextFs,

	bFs("copyFile"),
	aFs("copyFile"),

	waitBeforeNextFs,

	bFs("createWriteStream"),
	aFs("createWriteStream"),

	waitBeforeNextFs,

	bFs("ftruncate"),
	aFs("ftruncate"),

	() => NRS_SESSION.fs.addPathsToWhiteList(
		["tests/allowed/fs/futimes.js"],
		["tests/allowed/fs/hardLink.js"],
		["tests/allowed/fs/mkDir.js"],
		["tests/allowed/fs/rename.js"],
		["tests/allowed/fs/symLink.js"],
		["tests/allowed/fs/unlink.js"],
		["tests/allowed/fs/writeSync.js"],
	),

	waitBeforeNextFs,

	bFs("futimes"),
	aFs("futimes"),

	waitBeforeNextFs,

	bFs("hardLink"),
	aFs("hardLink"),

	waitBeforeNextFs,

	bFs("mkDir"),
	aFs("mkDir"),

	waitBeforeNextFs,

	bFs("rename"),
	aFs("rename"),

	waitBeforeNextFs,

	bFs("symLink"),
	aFs("symLink"),

	waitBeforeNextFs,

	bFs("unlink"),
	aFs("unlink"),

	waitBeforeNextFs,

	bFs("writeSync"),
	aFs("writeSync"),

	waitBeforeNextFs,

	() => NRS_SESSION.fs.addPathsToWhiteList(
		["tests/allowed/fs/promises/appendFile.js"],
		["tests/allowed/fs/promises/rename.js"],
		["tests/allowed/fs/promises/writeFile.js"],
		["tests/allowed/fs/promises/openAndAppend.js"],
	),

	bFPsV("appendFile"),
	aFPsV("appendFile"),

	waitBeforeNextFs,

	bFPsV("rename"),
	aFPsV("rename"),

	waitBeforeNextFs,

	bFPsV("writeFile"),
	aFPsV("writeFile"),

	waitBeforeNextFs,

	bFPsV("openAndAppend"),
	aFPsV("openAndAppend"),

];

const otherTests = [

	() => blockLogDash("Other Tests started"),

	() => NRS.process.blockBinding(NRS_PASSWORD, {

		returnProxyInsteadThrow: true,
		whiteLists: [{

			type: "project",
			list: [

				"tests/allowed/others/binding.js",

			]

		}],

	}),

	bOth("binding"),
	aOth("binding"),

	waitBeforeNextOther,

	() => FAST_NRS_SESSION.child_process.addPathsToWhiteList("tests/allowed/others/child_process.js"),

	bOth("child_process"),
	aOth("child_process"),

	waitBeforeNextOther,

	() => FAST_NRS_SESSION.dgram.addPathsToWhiteList("tests/allowed/others/dgram.js"),

	bOth("dgram"),
	aOth("dgram"),

	waitBeforeNextOther,

	() => FAST_NRS_SESSION.worker_threads.addPathsToWhiteList("tests/allowed/others/worker.js"),

	bOth("worker"),
	aOth("worker"),

	waitBeforeNextOther,

	() => FAST_NRS_SESSION.cluster.addPathsToWhiteList("tests/allowed/others/cluster.js"),

	bOth("cluster"),
	aOth("cluster"),

];

const tests = (function() {

	if(runOnlyConnectionTests) {

		return connectionTests;

	} else if(runOnlyFsTests) {

		return fsTests;

	} else if(runOnlyOtherTests) {

		return otherTests;

	} else {

		return connectionTests
			.concat([
				() => blockLogDash("Connection Tests finished"),
				waitBeforeNextFs,
			])
			.concat(fsTests)
			.concat([
				() => blockLogDash("FS Tests finished"),
				waitBeforeNextOther,
			])
			.concat(otherTests);

	}

})();

function getRemainingTestsCount() {

	return tests.filter(t => typeof t == "string").length;

}

process.thenTest = function (result) {

	if(result != true) {

		console.log("\x1b[31m%s\x1b[0m", `TEST #${thisTestId++}(Remaining: ${getRemainingTestsCount()}) ${thisTest} FAILED: ${result}\n`);

	} else {

		console.log(`TEST #${thisTestId++}(Remaining: ${getRemainingTestsCount()}) ${thisTest} COMPLETED SUCCESSFULLY!\n`);

	}

	clearTimeout(timer);
	timer = timeOut();

	test();

};

function timeOut() {

	return setTimeout(function () {

		console.log("\x1b[31m%s\x1b[0m", `TEST #${thisTestId}(Remaining: ${getRemainingTestsCount()}) ${thisTest} FAILED: TIMEOUT!\n`);
		process.exit(1);

	}, MAX_WAIT_INTERVAL_BEFORE_THROW);

}

let timer = timeOut();
let thisTestId = 1;
let thisTest = null;

function test() {

	if(!tests.length) return process.exit(0);

	thisTest = tests.shift();

	if(typeof thisTest == "function") {

		thisTest();

		return test();

	}

	if(typeof thisTest == "number") {

		clearTimeout(timer);

		return setTimeout(function () {

			timer = timeOut();

			test();

		}, thisTest);

	}

	const _test = require(thisTest);

	if(typeof _test == "function") {

		_test();

	}

}

const blockLogDash = text => console.log("\x1b[34m%s\x1b[0m", "-".repeat(repeats) + text + "-".repeat(repeats) + "\n");

console.log("");

process.on("exit", () => blockLogDash("All Tests finished"));

test();
