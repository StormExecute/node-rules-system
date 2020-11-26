const cluster = require('cluster');
const nodePath = require("path");

cluster.setupMaster({
	exec: nodePath.join(__dirname, "../../middle/bySpawn.js")
});

const test = cluster.fork();

if(!isReturnProxy(test)) {

	test.on('listening', () => {

		test.kill();

		process.thenTest("must be blocked!");

	});

} else {

	process.thenTest(true);

}