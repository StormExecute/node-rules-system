const { promises: fs } = require("fs");
const nodePath = require("path");

(async () => {

	const test = await fs.appendFile(nodePath.join(__dirname, "../../../fsTemp/blocked/simple.txt"), " newTest2");

	if(!isReturnProxy(test)) {

		process.thenTest("must be blocked!");

	} else {

		process.thenTest(true);

	}

})();