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

	() => NRS.connections.addProjectPathToWhiteList(NRS_PASSWORD, "tests/allowed/http.js"),

	"./blocked/http",
	"./allowed/http",

	waitBeforeNext,

	() => NRS.connections.addProjectPathToWhiteList(
		NRS_PASSWORD,
		["tests/index.js", "tests/allowed/httpSecond"],
		["tests/blocked/httpFullBlocked_allowed.js"]
	),

	"./blocked/httpSecond",
	"./allowed/httpSecond",

	waitBeforeNext,

	"./middle/httpByNRSGet",

	waitBeforeNext,

	() => {

		NRS.connections.allow(NRS_PASSWORD);
		NRS.connections.block(NRS_PASSWORD, "fullBlock" || true);

	},

	"./blocked/httpFullBlocked_blocked",
	"./blocked/httpFullBlocked_allowed",

	() => {

		NRS.connections.allow(NRS_PASSWORD);

	},

	"./allowed/httpAllowByRestore",

	waitBeforeNext,

	() => {

		NRS.connections.block(NRS_PASSWORD, false);
		NRS.connections.addProjectPathToWhiteList(NRS_PASSWORD, "tests/allowed/https.js", "tests/middle/httpsTest")

	},

	"./blocked/https",
	"./allowed/https",

	waitBeforeNext,

	() => {

		NRS_SESSION = NRS.session(NRS_PASSWORD);

		NRS_SESSION.connections.allow();

		delete require.cache[require.resolve("./allowed/httpAllowByRestore")];

	},

	"./allowed/httpAllowByRestore",

	waitBeforeNext,

	() => {

		NRS_SESSION.connections.block(true);

		delete require.cache[require.resolve("./blocked/httpFullBlocked_allowed")];

	},

	"./blocked/httpFullBlocked_allowed",

	() => {

		NRS_SESSION.connections.allow();
		NRS_SESSION.connections.block();

		delete require.cache[require.resolve("./blocked/httpFullBlocked_blocked")];

	},

	"./blocked/httpFullBlocked_blocked",

	//to slow down the fast pace
	waitBeforeNext,

	() => NRS_SESSION.connections.addProjectPathToWhiteList("tests/allowed/net.js"),

	"./blocked/net",
	"./allowed/net",

	waitBeforeNext,

	() => {

		global.NRS_SECURE_SESSION = NRS.secureSession(NRS_PASSWORD, [
			"tests/allowed/http2WithSecureSession"
		]);

	},

	"./blocked/http2WithSecureSession",
	"./allowed/http2WithSecureSession",

];

const fsTests = [

	() => {

		NRS.fs.addProjectPathToWhiteList(NRS_PASSWORD, "tests/allowed/fsWriteSimple.js");

		blockLogDash("FS Tests started");

	},

	"./blocked/fsWriteSimple",
	"./allowed/fsWriteSimple"

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