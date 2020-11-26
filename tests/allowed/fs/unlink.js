const fs = require("fs");
const nodePath = require("path");

const test = fs.unlinkSync(
	nodePath.join(__dirname, "../../fsTemp/allowed/simpleCopy.txt")
);

if(isReturnProxy(test)) {

	process.thenTest("must be allowed!");

} else {

	process.thenTest(true);

}