const dgram = require('dgram');

const test = dgram.createSocket('udp4');

if(!isReturnProxy(test)) {

	process.thenTest("must be blocked!");

} else {

	process.thenTest(true);

}