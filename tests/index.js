const NRS = require("../src/index");

const { NRS_PASSWORD, MAX_WAIT_INTERVAL } = require("./_settings");

NRS.init(NRS_PASSWORD);

NRS.connections.block(NRS_PASSWORD);

NRS.connections.addProjectPathToWhiteList(NRS_PASSWORD, "tests/allowed/http.js")

const tests = [

	"./blocked/http",
	"./allowed/http",

];

process.thenTest = function (result) {

	if(result != true) {

		console.log(`TEST ${thisTest} FAILED: ${result}!\n`);
		process.exit(1);

	}

	console.log(`TEST ${thisTest} COMPLETED SUCCESSFULLY!\n`)

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

	require(thisTest);

}

const repeats = 15;

console.log("");
console.log("-".repeat(repeats) + "Tests started" + "-".repeat(repeats) + "\n");

process.on("exit", () => console.log("-".repeat(repeats) + "Tests finished" + "-".repeat(repeats) + "\n"));

test();