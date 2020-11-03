const { promises: fs } = require("fs");
const nodePath = require("path");

const returnProxy = require("../../../../src/returnProxy");

(async () => {

	const fileHandle = await fs.open(nodePath.join(__dirname, "../../../fsTemp/allowed/byPromises.txt"), 'w');

	const test = await fileHandle.appendFile("!!!");

	if(test == returnProxy) {

		process.thenTest("must be allowed!");

	} else {

		process.thenTest(true);

	}

})()