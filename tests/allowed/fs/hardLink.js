const fs = require("fs");
const nodePath = require("path");

const returnProxy = require("../../../src/returnProxy");

const test = fs.linkSync(
	nodePath.join(__dirname, "../../fsTemp/allowed/simple.txt"),
	nodePath.join(__dirname, "../../fsTemp/allowed/simpleHardLink"),
);

if(test == returnProxy) {

	process.thenTest("must be allowed!");

} else {

	process.thenTest(true);

}