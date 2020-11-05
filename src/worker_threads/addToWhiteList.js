const main = require("../whiteListFunctionality");

const workerThreadsWhiteList = [];

[

	"addFullPathToWhiteList",
	"addProjectPathToWhiteList",
	"addDependencyToWhiteList",
	"addDependencyPathToWhiteList",

].forEach(exportFn => {

	module.exports[exportFn] = function (tryPass, ...args) {

		return main[exportFn](workerThreadsWhiteList, tryPass, args);

	};

});

module.exports.whiteList = workerThreadsWhiteList;