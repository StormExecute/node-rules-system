const main = require("../whiteListFunctionality");

const fsWhiteList = [];
fsWhiteList.name = "fs";

[

	"addCustomPathsToWhiteList",
	"addPathsToWhiteList",
	"addDependencyAndPathsToWhiteList",
	"addDependencyPathAndProjectPathsToWhiteList",

].forEach(exportFn => {

	module.exports[exportFn] = function (tryPass, ...args) {

		return main[exportFn](fsWhiteList, tryPass, args);

	};

});

module.exports.whiteList = fsWhiteList;