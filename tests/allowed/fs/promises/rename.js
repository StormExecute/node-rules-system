const { promises: fs } = require("fs");
const nodePath = require("path");

const returnProxy = require("../../../../src/returnProxy");

(async () => {

	const test = await fs.rename(
		nodePath.join(__dirname, "../../../fsTemp/allowed/simple.txt"),
		nodePath.join(__dirname, "../../../fsTemp/allowed/simpleRenamed.txt"),
	);

	if(test == returnProxy) {

		process.thenTest("must be allowed!");

	} else {

		process.thenTest(true);

	}

})();