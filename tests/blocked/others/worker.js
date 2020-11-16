const { Worker } = require('worker_threads');
const nodePath = require("path");

const returnProxy = require("../../../src/returnProxy");

const test = new Worker(nodePath.join(__dirname, "../../middle/bySpawn.js"));

if(test != returnProxy) {

	test.terminate().then(exitCode => {

		process.thenTest("must be blocked!");

	});

} else {

	process.thenTest(true);

}