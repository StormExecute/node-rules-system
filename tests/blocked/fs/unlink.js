const fs = require("fs");
const nodePath = require("path");

const test = fs.unlinkSync(
	nodePath.join(__dirname, "../../fsTemp/blocked/simpleCopy.txt")
);

if(!isReturnProxy(test)) {

	process.thenTest("must be blocked!");

} else {

	process.thenTest(true);

}