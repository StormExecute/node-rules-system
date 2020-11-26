const { promises: fs } = require("fs");
const nodePath = require("path");

(async () => {

	const test = await fs.writeFile(
		nodePath.join(__dirname, "../../../fsTemp/blocked/byPromises.txt"),
		"promises!"
	);

	if(!isReturnProxy(test)) {

		process.thenTest("must be blocked!");

	} else {

		process.thenTest(true);

	}

})();