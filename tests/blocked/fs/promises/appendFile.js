const { promises: fs } = require("fs");
const nodePath = require("path");

const returnProxy = require("../../../../src/returnProxy");

(async () => {

	const test = await fs.appendFile(nodePath.join(__dirname, "../../../fsTemp/blocked/simple.txt"), " newTest2");

	if(test != returnProxy) {

		process.thenTest("must be blocked!");

	} else {

		process.thenTest(true);

	}

})();