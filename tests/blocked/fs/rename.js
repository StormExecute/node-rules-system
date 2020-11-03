const fs = require("fs");
const nodePath = require("path");

const returnProxy = require("../../../src/returnProxy");

const test = fs.renameSync(
	nodePath.join(__dirname, "../../fsTemp/blocked/simpleDir"),
	nodePath.join(__dirname, "../../fsTemp/blocked/simpleDirectory"),
);

if(test != returnProxy) {

	process.thenTest("must be blocked!");

} else {

	process.thenTest(true);

}