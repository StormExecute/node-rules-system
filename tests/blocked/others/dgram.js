const dgram = require('dgram');

const returnProxy = require("../../../src/returnProxy");

const test = dgram.createSocket('udp4');

if(test != returnProxy) {

	process.thenTest("must be blocked!");

} else {

	process.thenTest(true);

}