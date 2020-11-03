const fs = require("fs");
const nodePath = require("path");

const returnProxy = require("../../../src/returnProxy");

const fd = fs.openSync(nodePath.join(__dirname, "../../fsTemp/allowed/simple.txt"), "w");

const test = fs.writeSync(fd, "newTest");

if(test == returnProxy) {

	process.thenTest("must be allowed!");

} else {

	fs.closeSync(fd);

	process.thenTest(true);

}