const fs = require("fs");
const nodePath = require("path");

const returnProxy = require("../../../src/returnProxy");

const fd = fs.openSync(nodePath.join(__dirname, "../../fsTemp/allowed/simple.txt"), "r+");

const test = fs.ftruncateSync(fd, 4);

if(test == returnProxy) {

	process.thenTest("must be allowed!");

} else {

	process.thenTest(true);

}