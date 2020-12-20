const dgram = require("dgram");

const test = dgram.createSocket('udp4');

if(isReturnProxy(test)) {

	process.thenTest("must be allowed!");

} else {

	process.thenTest(true);

}