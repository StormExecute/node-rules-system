const fs = require("fs");
const nodePath = require("path");

const test = fs.symlinkSync(
	nodePath.join(__dirname, "../../fsTemp/blocked/simple.txt"),
	nodePath.join(__dirname, "../../fsTemp/blocked/simpleSymLink"),
);

if(!isReturnProxy(test)) {

	process.thenTest("must be blocked!");

} else {

	process.thenTest(true);

}