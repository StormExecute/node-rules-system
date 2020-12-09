let then = false;

module.exports = function make(should) {

	return function (data) {

		if(then) return;

		then = true;

		if(should == "allow") return process.thenTest(true);
		else return process.thenTest("must be blocked!")

	}

};