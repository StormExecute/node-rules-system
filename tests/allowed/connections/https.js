const test = require("../../middle/httpsTest");

test(status => {

	if(status == "allow") return process.thenTest(true);
	else return process.thenTest("must be allowed!")

});