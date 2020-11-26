const fs = require("fs");
const nodePath = require("path");

const fd = fs.openSync(nodePath.join(__dirname, "../../fsTemp/allowed/simple.txt"), "r+");

const test = fs.ftruncateSync(fd, 4);

if(isReturnProxy(test)) {

	process.thenTest("must be allowed!");

} else {

	fs.closeSync(fd);

	process.thenTest(true);

}