const fs = require("fs");
const nodePath = require("path");

const returnProxy = require("../../../src/returnProxy");

const test = fs.mkdirSync(
	nodePath.join(__dirname, "../../fsTemp/allowed/simpleDir")
);

if(test == returnProxy) {

	process.thenTest("must be allowed!");

} else {

	process.thenTest(true);

}