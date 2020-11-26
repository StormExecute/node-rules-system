const fs = require("fs");
const nodePath = require("path");

const fd = fs.openSync(nodePath.join(__dirname, "../../fsTemp/allowed/simple.txt"), "r+");

const newAtime = new Date();
const newMtime = new Date();

const test = fs.futimesSync(fd, newAtime, newMtime);

if(isReturnProxy(test)) {

	process.thenTest("must be allowed!");

} else {

	fs.closeSync(fd);

	process.thenTest(true);

}