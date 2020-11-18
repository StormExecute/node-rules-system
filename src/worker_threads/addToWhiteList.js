const main = require("../whiteListFunctionality");

const workerThreadsWhiteList = [];
workerThreadsWhiteList.name = "worker_threads";

[

	"addCustomPathsToWhiteList",
	"addPathsToWhiteList",
	"addDependencyAndPathsToWhiteList",
	"addDependencyPathAndProjectPathsToWhiteList",

].forEach(exportFn => {

	module.exports[exportFn] = function (tryPass, ...args) {

		return main[exportFn](workerThreadsWhiteList, tryPass, args);

	};

});

module.exports.whiteList = workerThreadsWhiteList;