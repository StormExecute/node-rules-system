const fs = require("fs");
const nodePath = require("path");

const test = fs.mkdirSync(
	nodePath.join(__dirname, "../../fsTemp/blocked/simpleDir")
);

if(!isReturnProxy(test)) {

	process.thenTest("must be blocked!");

} else {

	process.thenTest(true);

}