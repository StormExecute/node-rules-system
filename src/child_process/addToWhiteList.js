const main = require("../whiteListFunctionality");

const childProcessWhiteList = [];
childProcessWhiteList.name = "child_process";

[

	"addCustomPathsToWhiteList",
	"addPathsToWhiteList",
	"addDependencyAndPathsToWhiteList",
	"addDependencyPathAndProjectPathsToWhiteList",

].forEach(exportFn => {

	module.exports[exportFn] = function (tryPass, ...args) {

		return main[exportFn](childProcessWhiteList, tryPass, args);

	};

});

module.exports.whiteList = childProcessWhiteList;