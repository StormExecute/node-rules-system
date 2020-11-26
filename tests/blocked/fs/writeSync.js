const fs = require("fs");
const nodePath = require("path");

const fd = fs.openSync(nodePath.join(__dirname, "../../fsTemp/blocked/simple.txt"), "w");

const test = fs.writeSync(fd, "newTest");

if(!isReturnProxy(test)) {

	process.thenTest("must be blocked!");

} else {

	fs.closeSync(fd);
	
	process.thenTest(true);

}