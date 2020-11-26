const fs = require("fs");
const nodePath = require("path");

const test = fs.renameSync(
	nodePath.join(__dirname, "../../fsTemp/allowed/simpleDir"),
	nodePath.join(__dirname, "../../fsTemp/allowed/simpleDirectory"),
);

if(isReturnProxy(test)) {

	process.thenTest("must be allowed!");

} else {

	process.thenTest(true);

}