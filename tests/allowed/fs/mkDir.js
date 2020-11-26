const fs = require("fs");
const nodePath = require("path");

const test = fs.mkdirSync(
	nodePath.join(__dirname, "../../fsTemp/allowed/simpleDir")
);

if(isReturnProxy(test)) {

	process.thenTest("must be allowed!");

} else {

	process.thenTest(true);

}