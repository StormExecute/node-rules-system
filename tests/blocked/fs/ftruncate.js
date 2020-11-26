const fs = require("fs");
const nodePath = require("path");

const fd = fs.openSync(nodePath.join(__dirname, "../../fsTemp/mustStay.txt"), "r+");

const test = fs.ftruncateSync(fd, 1);

if(!isReturnProxy(test)) {

	process.thenTest("must be blocked!");

} else {

	fs.closeSync(fd);

	process.thenTest(true);

}