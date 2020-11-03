const fs = require("fs");
const nodePath = require("path");

const returnProxy = require("../../../src/returnProxy");

const fd = fs.openSync(nodePath.join(__dirname, "../../fsTemp/mustStay.txt"), "r+");

const newAtime = new Date();
const newMtime = new Date();

const test = fs.futimesSync(fd, newAtime, newMtime);

if(test != returnProxy) {

	process.thenTest("must be blocked!");

} else {

	process.thenTest(true);

}