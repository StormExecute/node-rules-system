const test = require("../middle/httpsTest");

test(status => {

	if(status == "block") return process.thenTest(true);
	else return process.thenTest("must be blocked!")

});