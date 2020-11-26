const NRS = require("../../" + NRS_PATH);

const { NRS_PASSWORD, TEST_SITE: host } = require("../_settings");

const options = { host };
const callback = require("../functionality/httpCallback");

const request = NRS.connections.$http.get(NRS_PASSWORD, "request");

const test = request(options, callback("allow")).end();
if(isReturnProxy(test)) process.thenTest("must be allowed!");