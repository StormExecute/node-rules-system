const { Worker } = require("worker_threads");
const nodePath = require("path");

const needProcessVersion = require("../../../dependencies/needProcessVersion");

const test = new Worker(nodePath.join(__dirname, "../../middle/bySpawn.js"));

if(isReturnProxy(test)) {

	process.thenTest("must be allowed!");

} else {

	const then = exitCode => {

		process.thenTest(true);

	};

	if(~needProcessVersion("12.5.0")) {

		test.terminate().then(then);

	} else {

		test.terminate(then);

	}

}