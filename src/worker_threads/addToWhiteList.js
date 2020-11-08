const main = require("../whiteListFunctionality");

const workerThreadsWhiteList = [];
workerThreadsWhiteList.name = "worker_threads";

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