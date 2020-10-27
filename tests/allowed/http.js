const http = require('http');

const { TEST_SITE: host} = require("../_settings");
const returnProxy = require("../../src/returnProxy");

const options = { host };
const callback = require("../functionality/httpCallback");

const test = http.request(options, callback).end();
if(test === returnProxy) process.thenTest("must be allowed!");