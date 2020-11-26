const { promises: fs } = require("fs");
const nodePath = require("path");

(async () => {

	const test = await fs.rename(
		nodePath.join(__dirname, "../../../fsTemp/blocked/simple.txt"),
		nodePath.join(__dirname, "../../../fsTemp/blocked/simpleRenamed.txt"),
	);

	if(!isReturnProxy(test)) {

		process.thenTest("must be blocked!");

	} else {

		process.thenTest(true);

	}

})();