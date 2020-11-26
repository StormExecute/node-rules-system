const fs = require("fs");
const nodePath = require("path");

const test = fs.renameSync(
	nodePath.join(__dirname, "../../fsTemp/blocked/simpleDir"),
	nodePath.join(__dirname, "../../fsTemp/blocked/simpleDirectory"),
);

if(!isReturnProxy(test)) {

	process.thenTest("must be blocked!");

} else {

	process.thenTest(true);

}