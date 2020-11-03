const fs = require("fs");
const nodePath = require("path");

const returnProxy = require("../../../src/returnProxy");

const test = fs.mkdirSync(
	nodePath.join(__dirname, "../../fsTemp/blocked/simpleDir")
);

if(test != returnProxy) {

	process.thenTest("must be blocked!");

} else {

	process.thenTest(true);

}