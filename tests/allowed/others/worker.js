const { Worker } = require('worker_threads');
const nodePath = require("path");

const test = new Worker(nodePath.join(__dirname, "../../middle/bySpawn.js"));

if(isReturnProxy(test)) {

	process.thenTest("must be allowed!");

} else {

	test.terminate().then(exitCode => {

		process.thenTest(true);

	});

}