const fs = require("fs");
const nodePath = require("path");

const test = fs.appendFileSync(nodePath.join(__dirname, "../../fsTemp/allowed/simple.txt"), " test2");

if(isReturnProxy(test)) {

	process.thenTest("must be allowed!");

} else {

	process.thenTest(true);

}