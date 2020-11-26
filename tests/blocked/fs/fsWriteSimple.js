const fs = require("fs");
const nodePath = require("path");

const test = fs.writeFileSync(nodePath.join(__dirname, "../../fsTemp/blocked/simple.txt"), "test");

if(!isReturnProxy(test)) {

	process.thenTest("must be blocked!");

} else {

	process.thenTest(true);

}