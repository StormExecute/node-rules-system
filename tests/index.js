const NRS = require("../src/index");

const {
	NRS_PASSWORD,
	MAX_WAIT_INTERVAL_BEFORE_THROW,
	MAX_WAIT_INTERVAL_BEFORE_NEXT_TEST: waitBeforeNext,
	BLOCK_CONSOLE_LOG_DASH_REPEATS: repeats,
} = require("./_settings");

NRS.init(NRS_PASSWORD);

NRS.connections.block(NRS_PASSWORD);
NRS.fs.block(NRS_PASSWORD);

const clearFsTempBeforeRun = require("./clearFsTempBeforeRun");

const $unlinkSync = NRS.fs.$fs.get(NRS_PASSWORD, "unlinkSync");

clearFsTempBeforeRun($unlinkSync);

let NRS_SESSION = null;

const runOnlyConnectionTests = !!process.argv.filter(el => el == "-c" || el == "--connections").length || process.env.debugP;
const runOnlyFsTests = !!process.argv.filter(el => el == "-s" || el == "--fs").length || process.env.debugP;

const connectionTests = [

	() => blockLogDash("Connection Tests started"),

	() => NRS.connections.addProjectPathToWhiteList(NRS_PASSWORD, "tests/allowed/connections/http.js"),

	"./blocked/connections/http",
	"./allowed/connections/http",

	waitBeforeNext,

	() => NRS.connections.addProjectPathToWhiteList(
		NRS_PASSWORD,
		["tests/index.js", "tests/allowed/connections/httpSecond"],
		["tests/blocked/connections/httpFullBlocked_allowed.js"]
	),

	"./blocked/connections/httpSecond",
	"./allowed/connections/httpSecond",

	waitBeforeNext,

	"./middle/httpByNRSGet",

	waitBeforeNext,

	() => {

		NRS.connections.allow(NRS_PASSWORD);
		NRS.connections.block(NRS_PASSWORD, "fullBlock" || true);

	},

	"./blocked/connections/httpFullBlocked_blocked",
	"./blocked/connections/httpFullBlocked_allowed",

	() => {

		NRS.connections.allow(NRS_PASSWORD);

	},

	"./allowed/connections/httpAllowByRestore",

	waitBeforeNext,

	() => {

		NRS.connections.block(NRS_PASSWORD, false);
		NRS.connections.addProjectPathToWhiteList(NRS_PASSWORD, "tests/allowed/connections/https.js", "tests/middle/httpsTest")

	},

	"./blocked/connections/https",
	"./allowed/connections/https",

	waitBeforeNext,

	() => {

		NRS_SESSION = NRS.session(NRS_PASSWORD);

		NRS_SESSION.connections.allow();

		delete require.cache[require.resolve("./allowed/connections/httpAllowByRestore")];

	},

	"./allowed/connections/httpAllowByRestore",

	waitBeforeNext,

	() => {

		NRS_SESSION.connections.block(true);

		delete require.cache[require.resolve("./blocked/connections/httpFullBlocked_allowed")];

	},

	"./blocked/connections/httpFullBlocked_allowed",

	() => {

		NRS_SESSION.connections.allow();
		NRS_SESSION.connections.block();

		delete require.cache[require.resolve("./blocked/connections/httpFullBlocked_blocked")];

	},

	"./blocked/connections/httpFullBlocked_blocked",

	//to slow down the fast pace
	waitBeforeNext,

	() => NRS_SESSION.connections.addProjectPathToWhiteList("tests/allowed/connections/net.js"),

	"./blocked/connections/net",
	"./allowed/connections/net",

	waitBeforeNext,

	() => {

		global.NRS_SECURE_SESSION = NRS.secureSession(NRS_PASSWORD, [
			"tests/allowed/connections/http2WithSecureSession"
		]);

	},

	"./blocked/connections/http2WithSecureSession",
	"./allowed/connections/http2WithSecureSession",

];

const fsTests = [

	() => {

		NRS.fs.addProjectPathToWhiteList(NRS_PASSWORD, "tests/allowed/fs/fsWriteSimple.js");

		blockLogDash("FS Tests started");

	},

	"./blocked/fs/fsWriteSimple",
	"./allowed/fs/fsWriteSimple"

];

const tests = runOnlyConnectionTests
	? connectionTests
	: runOnlyFsTests
		? fsTests
		: connectionTests.concat([
			() => blockLogDash("Connection Tests finished"),
			waitBeforeNext,
		]).concat(fsTests);

function getRemainingTestsCount() {

	const copy = Object.assign([], tests);

	return copy.filter(t => typeof t == "string").length;

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