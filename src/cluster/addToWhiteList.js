const main = require("../whiteListFunctionality");

const clusterWhiteList = [];
clusterWhiteList.name = "cluster";

[

	"addFullPathToWhiteList",
	"addProjectPathToWhiteList",
	"addDependencyToWhiteList",
	"addDependencyPathToWhiteList",

].forEach(exportFn => {

	module.exports[exportFn] = function (tryPass, ...args) {

		return main[exportFn](clusterWhiteList, tryPass, args);

	};

});

module.exports.whiteList = clusterWhiteList;