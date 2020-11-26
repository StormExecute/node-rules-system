const fs = require("fs");
const nodePath = require("path");

const test = fs.createWriteStream(
	nodePath.join(__dirname, "../../fsTemp/allowed/byWriteStream.txt"),
);

test.write('beep ');

if(isReturnProxy(test)) {

	process.thenTest("must be allowed!");

} else {

	test.on('finish', () => process.thenTest(true));
	test.end('boop\n');

}