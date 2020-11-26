const { promises: fs } = require("fs");
const nodePath = require("path");

(async () => {

	const test = await fs.appendFile(nodePath.join(__dirname, "../../../fsTemp/allowed/simple.txt"), " newTest2");

	if(isReturnProxy(test)) {

		process.thenTest("must be allowed!");

	} else {

		process.thenTest(true);

	}

})();