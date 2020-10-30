const NRS = require("../src/index");

const { NRS_PASSWORD, MAX_WAIT_INTERVAL_BEFORE_THROW, MAX_WAIT_INTERVAL_BEFORE_NEXT_TEST: waitBeforeNext } = require("./_settings");

NRS.init(NRS_PASSWORD);

NRS.connections.block(NRS_PASSWORD);

let NRS_SESSION = null;

const tests = [

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

	() => NRS_SESSION.connections.addProjectPathToWhiteList("tests/allowed/net.js"),

	"./blocked/net",
	"./allowed/net",

];

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

const repeats = 15;

console.log("");
console.log("-".repeat(repeats) + "Tests started" + "-".repeat(repeats) + "\n");

process.on("exit", () => console.log("-".repeat(repeats) + "Tests finished" + "-".repeat(repeats) + "\n"));

test();