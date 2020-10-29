const NRS = require("../../src/index");

const { NRS_PASSWORD, TEST_SITE: host } = require("../_settings");
const returnProxy = require("../../src/returnProxy");

const options = { host };
const callback = require("../functionality/httpCallback");

const request = NRS.connections.$http.get(NRS_PASSWORD, "request");

const test = request(options, callback("allow")).end();
if(test === returnProxy) process.thenTest("must be allowed!");