const { StringMatch } = require("./_data/primordials");

function getCallerFnName() {

	const error = new Error();

	const allMatches = StringMatch( error.stack, /(\w+)@|at (\w+) \(/g );

	const parentMatches = StringMatch( allMatches[2], /(\w+)@|at (\w+) \(/ );

	return parentMatches[1] || parentMatches[2];

}

module.exports = getCallerFnName;