const fs = require("fs");
const nodePath = require("path");

const returnProxy = require("../../../src/returnProxy");

const test = fs.unlinkSync(
	nodePath.join(__dirname, "../../fsTemp/blocked/simpleCopy.txt")
);

if(test != returnProxy) {

	process.thenTest("must be blocked!");

} else {

	process.thenTest(true);

}