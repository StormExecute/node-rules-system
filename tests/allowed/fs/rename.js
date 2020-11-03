const fs = require("fs");
const nodePath = require("path");

const returnProxy = require("../../../src/returnProxy");

const test = fs.renameSync(
	nodePath.join(__dirname, "../../fsTemp/allowed/simpleDir"),
	nodePath.join(__dirname, "../../fsTemp/allowed/simpleDirectory"),
);

if(test == returnProxy) {

	process.thenTest("must be allowed!");

} else {

	process.thenTest(true);

}