module.exports = function make(should) {

	return function (data) {

		if(should == "allow") return process.thenTest(true);
		else return process.thenTest("must be blocked!")

	}

};