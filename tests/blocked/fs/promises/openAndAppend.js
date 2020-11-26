const { promises: fs } = require("fs");
const nodePath = require("path");

(async () => {

	const fileHandle = await fs.open(nodePath.join(__dirname, "../../../fsTemp/blocked/byPromises.txt"), 'w');

	const test = await fileHandle.__proto__.appendFile.apply(fileHandle, ["!!!"]);

	if(!isReturnProxy(test)) {

		process.thenTest("must be blocked!");

	} else {

		await fileHandle.close();

		process.thenTest(true);

	}

})()