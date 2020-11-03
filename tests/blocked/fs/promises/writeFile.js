const { promises: fs } = require("fs");
const nodePath = require("path");

const returnProxy = require("../../../../src/returnProxy");

(async () => {

	const test = await fs.writeFile(
		nodePath.join(__dirname, "../../../fsTemp/blocked/byPromises.txt"),
		"promises!"
	);

	if(test != returnProxy) {

		process.thenTest("must be blocked!");

	} else {

		process.thenTest(true);

	}

})();