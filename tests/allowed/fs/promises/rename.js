const { promises: fs } = require("fs");
const nodePath = require("path");

(async () => {

	const test = await fs.rename(
		nodePath.join(__dirname, "../../../fsTemp/allowed/simple.txt"),
		nodePath.join(__dirname, "../../../fsTemp/allowed/simpleRenamed.txt"),
	);

	if(isReturnProxy(test)) {

		process.thenTest("must be allowed!");

	} else {

		process.thenTest(true);

	}

})();