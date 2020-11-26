const fs = require("fs");
const nodePath = require("path");

const test = fs.createWriteStream(
	nodePath.join(__dirname, "../../fsTemp/blocked/byWriteStream.txt"),
);

test.write('beep ');

if(!isReturnProxy(test)) {

	test.on('finish', () => process.thenTest("must be blocked!"));
	test.end('boop\n');

} else {

	process.thenTest(true);

}