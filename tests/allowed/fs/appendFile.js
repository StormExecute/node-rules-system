const fs = require("fs");
const nodePath = require("path");

const returnProxy = require("../../../src/returnProxy");

const test = fs.appendFileSync(nodePath.join(__dirname, "../../fsTemp/allowed/simple.txt"), " test2");

if(test == returnProxy) {

	process.thenTest("must be allowed!");

} else {

	process.thenTest(true);

}