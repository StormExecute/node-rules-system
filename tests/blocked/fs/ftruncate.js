const fs = require("fs");
const nodePath = require("path");

const returnProxy = require("../../../src/returnProxy");

const fd = fs.openSync(nodePath.join(__dirname, "../../fsTemp/mustStay.txt"), "r+");

const test = fs.ftruncateSync(fd, 1);

if(test != returnProxy) {

	process.thenTest("must be blocked!");

} else {

	process.thenTest(true);

}