const dgram = require('dgram');

const returnProxy = require("../../../src/returnProxy");

const test = dgram.createSocket('udp4');

if(test == returnProxy) {

	process.thenTest("must be allowed!");

} else {

	process.thenTest(true);

}