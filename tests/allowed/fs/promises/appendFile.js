const { promises: fs } = require("fs");
const nodePath = require("path");

const returnProxy = require("../../../../src/returnProxy");

(async () => {

	const test = await fs.appendFile(nodePath.join(__dirname, "../../../fsTemp/allowed/simple.txt"), " newTest2");

	if(test == returnProxy) {

		process.thenTest("must be allowed!");

	} else {

		process.thenTest(true);

	}

})();