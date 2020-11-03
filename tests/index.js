const NRS = require("../src/index");

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

const clearFsTempBeforeRun = require("./clearFsTempBeforeRun");
const $unlinkSync = NRS.fs.$fs.get(NRS_PASSWORD, "unlinkSync");
clearFsTempBeforeRun($unlinkSync);

const mustStayFile = require("./mustStayFile");
const $writeFileSync = NRS.fs.$fs.get(NRS_PASSWORD, "writeFileSync");
mustStayFile($writeFileSync);

let NRS_SESSION = null;

const runOnlyConnectionTests = !!process.argv.filter(el => el == "-c" || el == "--connections").length || process.env.debugP;
const runOnlyFsTests = !!process.argv.filter(el => el == "-s" || el == "--fs").length || process.env.debugP;
const runOnlyOtherTests = !!process.argv.filter(el => el == "-o" || el == "--others").length || process.env.debugP;

const bConn = filename => "./blocked/connections/" + filename;
const bFs = filename => "./blocked/fs/" + filename;
const bOth = filename => "./blocked/others/" + filename;

const aConn = filename => "./allowed/connections/" + filename;
const aFs = filename => "./allowed/fs/" + filename;
const aOth = filename => "./allowed/others/" + filename;

const connectionTests = [

	() => blockLogDash("Connection Tests started"),

	() => NRS.connections.addProjectPathToWhiteList(NRS_PASSWORD, "tests/allowed/connections/http.js"),

	bConn("http"),
	aConn("http"),

	waitBeforeNextConnection,

	() => NRS.connections.addProjectPathToWhiteList(
		NRS_PASSWORD,
		["tests/index.js", "tests/allowed/connections/httpSecond"],
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
		NRS.connections.addProjectPathToWhiteList(NRS_PASSWORD, "tests/allowed/connections/https.js", "tests/middle/httpsTest")

	},

	bConn("https"),
	aConn("https"),

	waitBeforeNextConnection,

	() => {

		NRS_SESSION = NRS.session(NRS_PASSWORD);

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

	() => NRS_SESSION.connections.addProjectPathToWhiteList("tests/allowed/connections/net.js"),

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

];

const fsTests = [

	() => {

		NRS.fs.addProjectPathToWhiteList(NRS_PASSWORD, "tests/allowed/fs/fsWriteSimple.js");

		blockLogDash("FS Tests started");

	},

	bFs("fsWriteSimple"),
	aFs("fsWriteSimple"),

	waitBeforeNextFs,

	() => NRS.fs.addProjectPathToWhiteList(NRS_PASSWORD,
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

];

const otherTests = [

	() => blockLogDash("Other Tests started"),

	() => NRS.process.blockBinding(NRS_PASSWORD, {

		returnProxyInsteadThrow: true,
		whiteListType: "project",
		whiteList: [
			"tests/allowed/others/binding.js",
		]

	}),

	bOth("binding"),
	aOth("binding"),

	//waitBeforeNextOther,

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
			]);

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