const main = require("../whiteListFunctionality");

const clusterWhiteList = [];
clusterWhiteList.name = "cluster";

[

	"addCustomPathsToWhiteList",
	"addPathsToWhiteList",
	"addDependencyAndPathsToWhiteList",
	"addDependencyPathAndProjectPathsToWhiteList",

].forEach(exportFn => {

	module.exports[exportFn] = function (tryPass, ...args) {

		return main[exportFn](clusterWhiteList, tryPass, args);

	};

});

module.exports.whiteList = clusterWhiteList;