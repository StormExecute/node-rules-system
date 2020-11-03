const returnProxy = require("../../../src/returnProxy");

const test = process.binding("v8");

if(test != returnProxy) {

	process.thenTest("must be blocked!");

} else {

	process.thenTest(true);

}