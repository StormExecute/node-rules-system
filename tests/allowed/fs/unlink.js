const fs = require("fs");
const nodePath = require("path");

const returnProxy = require("../../../src/returnProxy");

const test = fs.unlinkSync(
	nodePath.join(__dirname, "../../fsTemp/allowed/simpleCopy.txt")
);

if(test == returnProxy) {

	process.thenTest("must be allowed!");

} else {

	process.thenTest(true);

}