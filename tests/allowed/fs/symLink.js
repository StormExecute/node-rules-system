const fs = require("fs");
const nodePath = require("path");

const test = fs.symlinkSync(
	nodePath.join(__dirname, "../../fsTemp/allowed/simple.txt"),
	nodePath.join(__dirname, "../../fsTemp/allowed/simpleSymLink"),
);

if(isReturnProxy(test)) {

	process.thenTest("must be allowed!");

} else {

	process.thenTest(true);

}