const fs = require("fs");
const nodePath = require("path");

const returnProxy = require("../../../src/returnProxy");

const test = fs.appendFileSync(nodePath.join(__dirname, "../../fsTemp/blocked/simple.txt"), " test2");

if(test != returnProxy) {

	process.thenTest("must be blocked!");

} else {

	process.thenTest(true);

}