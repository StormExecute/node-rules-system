const fs = require("fs");
const nodePath = require("path");

const returnProxy = require("../../../src/returnProxy");

const test = fs.symlinkSync(
	nodePath.join(__dirname, "../../fsTemp/allowed/simple.txt"),
	nodePath.join(__dirname, "../../fsTemp/allowed/simpleSymLink"),
);

if(test == returnProxy) {

	process.thenTest("must be allowed!");

} else {

	process.thenTest(true);

}