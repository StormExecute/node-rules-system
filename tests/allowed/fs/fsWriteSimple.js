const fs = require("fs");
const nodePath = require("path");

const test = fs.writeFileSync(nodePath.join(__dirname, "../../fsTemp/allowed/simple.txt"), "test");

if(isReturnProxy(test)) {

	process.thenTest("must be allowed!");

} else {

	process.thenTest(true);

}