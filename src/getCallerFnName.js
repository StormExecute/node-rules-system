function getCallerFnName() {

	const error = new Error();

	const allMatches = error.stack.match(/(\w+)@|at (\w+) \(/g);

	const parentMatches = allMatches[2].match(/(\w+)@|at (\w+) \(/);

	return parentMatches[1] || parentMatches[2];

}

module.exports = getCallerFnName;