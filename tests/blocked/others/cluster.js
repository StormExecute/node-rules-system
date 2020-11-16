const cluster = require('cluster');
const nodePath = require("path");

const returnProxy = require("../../../src/returnProxy");

cluster.setupMaster({
	exec: nodePath.join(__dirname, "../../middle/bySpawn.js")
});

const test = cluster.fork();

if(test != returnProxy) {

	test.on('listening', () => {

		test.kill();

		process.thenTest("must be blocked!");

	});

} else {

	process.thenTest(true);

}