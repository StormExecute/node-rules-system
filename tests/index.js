const NRS = require("../src/index");

const { NRS_PASSWORD, MAX_WAIT_INTERVAL } = require("./_settings");

NRS.init(NRS_PASSWORD);

NRS.connections.block(NRS_PASSWORD);

const tests = [

	() => NRS.connections.addProjectPathToWhiteList(NRS_PASSWORD, "tests/allowed/http.js"),

	"./blocked/http",
	"./allowed/http",

	700,

	() => NRS.connections.addProjectPathToWhiteList(NRS_PASSWORD, "tests/index.js", "tests/allowed/httpSecond"),

	"./blocked/httpSecond",
	"./allowed/httpSecond",

	700,

	"./middle/httpByNRSGet",

	700,

	() => {

		NRS.connections.allow(NRS_PASSWORD);
		NRS.connections.block(NRS_PASSWORD, "fullBlock" || true);
		NRS.connections.addProjectPathToWhiteList(NRS_PASSWORD, "tests/blocked/httpFullBlocked_allowed.js")

	},

	"./blocked/httpFullBlocked_blocked",
	"./blocked/httpFullBlocked_allowed",

	() => {

		NRS.connections.allow(NRS_PASSWORD);

	},

	"./allowed/httpAllowByRestore",

	700,

	() => {

		NRS.connections.block(NRS_PASSWORD, false);
		NRS.connections.addProjectPathToWhiteList(NRS_PASSWORD, "tests/allowed/https.js", "tests/middle/httpsTest")

	},

	700,

	"./blocked/https",
	"./allowed/https",

];

process.thenTest = function (result) {

	if(result != true) {

		console.log(`TEST ${thisTest} FAILED: ${result}\n`);

	} else {

		console.log(`TEST ${thisTest} COMPLETED SUCCESSFULLY!\n`);

	}

	clearTimeout(timer);
	timer = timeOut();

	test();

};

function timeOut() {

	return setTimeout(function () {

		console.log(`TEST ${thisTest} FAILED: TIMEOUT!\n`);
		process.exit(1);

	}, MAX_WAIT_INTERVAL);

}

let timer = timeOut();

let thisTest = tests[0];

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