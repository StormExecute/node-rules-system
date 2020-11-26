const fs = require("fs");
const nodePath = require("path");

const test = fs.linkSync(
	nodePath.join(__dirname, "../../fsTemp/allowed/simple.txt"),
	nodePath.join(__dirname, "../../fsTemp/allowed/simpleHardLink"),
);

if(isReturnProxy(test)) {

	process.thenTest("must be allowed!");

} else {

	process.thenTest(true);

}