const cluster = require("cluster");
const nodePath = require("path");

cluster.setupMaster({
	exec: nodePath.join(__dirname, "../../middle/bySpawn.js")
});

const test = cluster.fork();

if(isReturnProxy(test)) {

	process.thenTest("must be allowed!");

} else {

	test.on('online', () => {

		test.kill();

		process.thenTest(true);

	});

}