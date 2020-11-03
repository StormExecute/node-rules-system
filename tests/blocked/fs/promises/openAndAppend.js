const { promises: fs } = require("fs");
const nodePath = require("path");

const returnProxy = require("../../../../src/returnProxy");

(async () => {

	const fileHandle = await fs.open(nodePath.join(__dirname, "../../../fsTemp/blocked/byPromises.txt"), 'w');

	const test = await fileHandle.appendFile("!!!");

	if(test != returnProxy) {

		process.thenTest("must be blocked!");

	} else {

		process.thenTest(true);

	}

})()