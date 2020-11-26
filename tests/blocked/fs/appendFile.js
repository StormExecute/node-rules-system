const fs = require("fs");
const nodePath = require("path");

const test = fs.appendFileSync(nodePath.join(__dirname, "../../fsTemp/blocked/simple.txt"), " test2");

if(!isReturnProxy(test)) {

	process.thenTest("must be blocked!");

} else {

	process.thenTest(true);

}