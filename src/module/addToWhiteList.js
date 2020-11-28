const main = require("../whiteListFunctionality");

const moduleWhiteList = [];
moduleWhiteList.name = "module";

[

	"addCustomPathsToWhiteList",
	"addPathsToWhiteList",
	"addDependencyAndPathsToWhiteList",
	"addDependencyPathAndProjectPathsToWhiteList",

].forEach(exportFn => {

	module.exports[exportFn] = function (tryPass, ...args) {

		return main[exportFn](moduleWhiteList, tryPass, args);

	};

});

module.exports.whiteList = moduleWhiteList;