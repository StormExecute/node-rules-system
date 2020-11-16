const cluster = require('cluster');
const nodePath = require("path");

const returnProxy = require("../../../src/returnProxy");

cluster.setupMaster({
	exec: nodePath.join(__dirname, "../../middle/bySpawn.js")
});

const test = cluster.fork();

if(test == returnProxy) {

	process.thenTest("must be allowed!");

} else {

	test.on('online', () => {

		test.kill();

		process.thenTest(true);

	});

}