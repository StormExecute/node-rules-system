const { promises: fs } = require("fs");
const nodePath = require("path");

(async () => {

	const fileHandle = await fs.open(nodePath.join(__dirname, "../../../fsTemp/allowed/byPromises.txt"), 'w');

	const test = await fileHandle.appendFile("!!!");

	if(isReturnProxy(test)) {

		process.thenTest("must be allowed!");

	} else {

		await fileHandle.close();

		process.thenTest(true);

	}

})()